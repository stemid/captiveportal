#!/usr/bin/env python
# Python helper tool to purge expired clients from DB and iptables. Requires
# root privileges for iptc to work.

from sys import exit
from argparse import ArgumentParser, FileType
from pprint import pprint as pp
from configparser import RawConfigParser
from datetime import datetime, timedelta

import errors
from storage import StoragePostgres
from client import Client


parser = ArgumentParser((
    'Purge expired clients by disabling them.'
))

parser.add_argument(
    '--config',
    type=FileType('r'),
    required=True,
    help='Configuration file'
)

args = parser.parse_args()

config = RawConfigParser()
config.readfp(args.config)

sr = StoragePostgres(config=config)

for client_id in sr.client_ids():
    client = Client(
        storage=sr,
        chain=config.get('iptables', 'chain'),
        client_id=client_id[0]
    )

    if datetime.now() > client.expires:
        client.enabled = False
        client.commit()
    else:
        # Simply commit whatever was loaded during Client.__init__(), like
        # up-to-date packet count stats for example.
        client.commit()