#!/usr/bin/env python

from argparse import ArgumentParser
from pprint import pprint as pp

import iptc

parser = ArgumentParser()

parser.add_argument('--chain', required=True)
parser.add_argument('--protocol', required=True)
parser.add_argument('--src-ip', required=True)

args = parser.parse_args()

table = iptc.Table(iptc.Table.MANGLE)
chain = iptc.Chain(table, args.chain)

# Check if rule exists
for rule in chain.rules:
    src_ip = rule.src
    if src_ip.startswith(args.src_ip):
        print('Rule exists')
        break
else:
    rule = iptc.Rule()
    rule.src = args.src_ip
    rule.protocol = args.protocol
    rule.target = iptc.Target(rule, 'RETURN')
    chain.insert_rule(rule)
