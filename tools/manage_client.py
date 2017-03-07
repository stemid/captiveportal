#!/usr/bin/env python
# Python helper tool to add IPtables rule using the iptc library. This must
# of course run as root for iptc to work.

from sys import exit
from argparse import ArgumentParser, FileType
from pprint import pprint as pp
from configparser import RawConfigParser

import errors
from storage import StoragePostgres
from client import Client

parser = ArgumentParser((
    'Handle clients in the captive portal. Default mode of operation is to'
    ' create new clients and enable them. Other mode is to --disable the '
    'client. And last mode is to --delete the client completely.'
))

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
    '--protocol',
    required=True,
    choices=['tcp', 'udp'],
    help='Protocol for client'
)

parser.add_argument(
    '--config',
    type=FileType('r'),
    required=True,
    help='Configuration file'
)

parser.add_argument(
    'src_ip',
    help='Client source IP to add'
)

args = parser.parse_args()

config = RawConfigParser()
config.readfp(args.config)

sr = StoragePostgres(config=config)
try:
    client = Client(
        storage=sr,
        ip_address=args.src_ip,
        protocol=args.protocol,
        chain=config.get('iptables', 'chain')
    )
except errors.StorageNotFound:
    print('Client not found')
    exit(1)

if args.disable:
    # For non-existing clients this actually creates them in disabled mode.
    client.enabled = False
    client.commit()
elif args.delete:
    client.delete()
else:
    client.enabled = True
    client.commit()
