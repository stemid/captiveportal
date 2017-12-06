#!/usr/bin/env python
# Python helper tool to add portal clients into ipset and DB via CLI.
#
# by Stefan Midjich

from os import getuid
from sys import exit
from argparse import ArgumentParser, FileType, ArgumentTypeError
from pprint import pprint as pp
from configparser import RawConfigParser
from datetime import datetime, timedelta
from io import BytesIO

from portalclientlib.client import Client
from portalclientlib.storage import StoragePostgres
from portalclientlib.helpers import run_ipset


# Custom defined argparse types for dates
def valid_date_type(arg_date_str):
    """custom argparse *date* type for user dates values given from the command line"""
    try:
        return datetime.strptime(arg_date_str, "%Y-%m-%d")
    except ValueError:
        msg = "Given Date ({0}) not valid! Expected format, YYYY-MM-DD!".format(arg_date_str)
        raise ArgumentTypeError(msg)


def valid_datetime_type(arg_datetime_str):
    """custom argparse type for user datetime values given from the command line"""
    try:
        return datetime.strptime(arg_datetime_str, "%Y-%m-%d %H:%M")
    except ValueError:
        msg = "Given Datetime ({0}) not valid! Expected format, 'YYYY-MM-DD HH:mm'!".format(
            arg_datetime_str)
        raise ArgumentTypeError(msg)


parser = ArgumentParser(
    '''
    Handle clients in the captive portal. Default mode of operation is to
    create new clients and enable them.
    '''
)

parser.add_argument(
    '-v', '--verbose',
    action='count',
    default=False,
    dest='verbose',
    help='Verbose output, use more v\'s to increase verbosity'
)

parser.add_argument(
    '--expires',
    type=valid_datetime_type,
    default=datetime.now() + timedelta(days=1),
    help='Expiry date in format "YYYY-MM-DD HH:mm"'
)

parser.add_argument(
    '--disable',
    default=False,
    action='store_true',
    help='Disable the client in the DB and delete from firewall'
)

parser.add_argument(
    '--delete',
    default=False,
    action='store_true',
    help='Delete the client from DB and firewall. Normally this is excessive.'
)

parser.add_argument(
    '--refresh',
    action='store_true',
    help='Refresh client ipset data first'
)

parser.add_argument(
    '--config',
    type=FileType('r'),
    required=True,
    help='Configuration file'
)

parser.add_argument(
    'src_ip',
    nargs='*',
    help='Client source IP to add'
)

args = parser.parse_args()

config = RawConfigParser()
config.readfp(args.config)

sr = StoragePostgres(config=config)

if getuid() == 0:
    use_sudo = False
else:
    use_sudo = True

# Sync clients and packet counters from ipset into storage.
# This is a long process that ensures ipset and the DB have the same clients.
# Also that old clients are disabled and that active clients have fresh data
# in DB showing they're active.
if args.refresh:
    proc = run_ipset(
        'list',
        config.get('portalclient', 'ipset_name'),
        '-output',
        'save',
        use_sudo=use_sudo,
        timeout=600
    )

    current_time = datetime.now()

    for _line in proc.splitlines():
        # Convert from bytestring first
        line = _line.decode('utf-8')
        expired = False

        if not line.startswith('add'):
            continue

        (
            cmd,
            set_name,
            client_ip,
            packets_str,
            packets_val,
            bytes_str,
            bytes_val
        ) = line.split()

        # Init a client instance, this will fetch an existing client matching
        # the IP from DB and load its data. Or create a new with default
        # values.
        try:
            client = Client(
                storage=sr,
                ip_address=client_ip,
                ipset_name=config.get('portalclient', 'ipset_name'),
                use_sudo=use_sudo
            )
        except Exception as e:
            if args.verbose:
                print('Failed to init client:{ip}: {error}'.format(
                    ip=client_ip,
                    error=str(e)
                ))

            if args.verbose > 2:
                raise

            continue

        # Set the expired variable for future processing if the client has
        # has expired.
        if current_time > client.expires:
            expired = True

        # The _new attribute is only set on brand new clients not previously
        # in DB. This will get less and less common as DB builds up.
        if client._new:
            if args.verbose > 1:
                print('Client:{ip} created'.format(
                    ip=client.ip_address
                ))
            client.enabled = True

        # In this case the client exists in ipset but is disabled in DB so
        # we enable it and set a new expired date for it. As if it's a new
        # (reset) client.
        if not client.enabled:
            if args.verbose:
                print('Client:{ip} enabled'.format(
                    ip=client.ip_address
                ))
            client.enabled = True
            client.expires = current_time

        # If we have more packets in ipset output now than we had in DB we
        # consider that an active client.
        if int(packets_val) > client.last_packets:
            if args.verbose > 1:
                print('Client:{ip} updated'.format(
                    ip=client.ip_address
                ))

            client.last_packets = packets_val
            client.last_activity = current_time
        elif int(packets_val) < client.last_packets:
            # Otherwise this client could have been reset and in that case
            # we reset its values. This should only happen once in every
            # unique clients life-time.
            if args.verbose > 1:
                print('Client:{ip} reset'.format(
                    ip=client.ip_address
                ))

            client.last_packets = packets_val
            client.last_activity = current_time
            client.expires = datetime.now() + timedelta(days=1)

        # Here we handle fringe cases where clients have had no activity
        # logged and are expired.
        if not client.last_activity and expired:
            if args.verbose:
                print('Client:{ip} disabled, no activity logged'.format(
                    ip=client.ip_address
                ))

            client.enabled = False

        # If the client has had activity logged but is expired we need to
        # ensure that we don't disable active clients by only disabling
        # the ones with more than 1 day since their last activity.
        if client.last_activity and expired:
            active_diff = current_time - client.last_activity

            if active_diff.days >= 1:
                if args.verbose:
                    print('Client:{ip} disabled, no activity since "{last_activity}"'.format(
                        last_activity=client.last_activity,
                        ip=client.ip_address
                    ))

                client.enabled = False

        client.commit()

for src_ip in args.src_ip:
    # Get client by IP or create a new one.
    client = Client(
        storage=sr,
        ip_address=src_ip,
        ipset_name=config.get('portalclient', 'ipset_name'),
        use_sudo=use_sudo
    )

    if args.delete:
        # This both deletes the ipset entry AND the client entry from DB. Normally
        # excessive and disable is better.
        client.delete()
        exit(0)

    if args.disable:
        client.enabled = False
    else:
        client.enabled = True

        if args.expires:
            client.expires = args.expires
        else:
            client.expires = datetime.now + timedelta(days=1)

    client.commit()
