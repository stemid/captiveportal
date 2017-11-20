#!/usr/bin/env python
# Python helper tool to add IPtables rule using the iptc library. This must
# of course run as root for iptc to work.

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
    help='Delete the client from DB and firewall'
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

if args.refresh:
    # Sync clients and packet counters from ipset into storage.
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

        if current_time > client.expires:
            expired = True

        if client._new:
            if args.verbose:
                print('Creating new client:{ip}'.format(
                    ip=client.ip_address
                ))
            client.enabled = True

        if not client.last_activity and expired:
            if args.verbose:
                print('Client:{ip} disabled, no activity ever logged'.format(
                    ip=client.ip_address
                ))

            client.enabled = False
            client.commit()
            # No more processing for these types of clients.
            continue

        if int(packets_val) > client.last_packets:
            if args.verbose > 1:
                print('Client:{ip} updated'.format(
                    ip=client.ip_address
                ))

            client.last_packets = packets_val
            client.last_activity = current_time

        if client.last_activity and expired:
            active_diff = current_time - client.last_activity

            if active_diff.days >= 1 and client.last_activity != current_time:
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

    client.commit()
