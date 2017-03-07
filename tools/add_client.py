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

parser = ArgumentParser()

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
    print('Could not find client')
    exit(1)

client.enabled = True
client.commit()
