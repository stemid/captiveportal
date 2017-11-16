#!/usr/bin/env python
# Python helper tool to add IPtables rule using the iptc library. This must
# of course run as root for iptc to work.

from sys import exit
from argparse import ArgumentParser, FileType, ArgumentTypeError
from pprint import pprint as pp
from configparser import RawConfigParser
from datetime import datetime, timedelta
from io import BytesIO

import errors
from helpers import run_ipset
from storage import StoragePostgres
from client import Client


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
        msg = "Given Datetime ({0}) not valid! Expected format, 'YYYY-MM-DD HH:mm'!".format(arg_datetime_str)
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

if args.refresh:
    # Sync clients and packet counters from ipset into storage.
    proc = run_ipset(
        'list',
        config.get('ipset', 'set_name'),
        '-output',
        'save',
        use_sudo=False,
        timeout=600
    )

    current_date = datetime.now()

    for _line in proc.stdout.splitlines():
        # Convert from bytestring first
        line = _line.decode('utf-8')

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
                ipset_name=config.get('ipset', 'set_name')
            )
        except Exception as e:
            if args.verbose:
                print('Failed to init client:{ip}: {error}'.format(
                    ip=client_ip,
                    error=str(e)
                ))
            continue

        if client.new:
            client.commit()

        if int(packets_val) != client.last_packets:
            client.last_activity = current_date
            client.last_packets = packets_val
            client.commit()

        # Also do a purge of clients that have no traffic for 24 hrs
        if client.last_activity:
            time_diff = client.last_activity-client.created
            if client.last_packets >= packets_val and time_diff.days >= 1:
                client.enabled = False
                client.commit()

for src_ip in args.src_ip:
    # Get client by IP or create a new one.
    client = Client(
        storage=sr,
        ip_address=src_ip,
        ipset_name=config.get('ipset', 'set_name')
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
