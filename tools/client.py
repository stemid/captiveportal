"""
Handles "clients" in IPtables for captive portal.
"""

from uuid import uuid4
from datetime import datetime

#import iptc

import errors


class Client(object):

    def __init__(self, **kw):
        # Required parameters
        self.storage = kw.pop('storage')
        self.chain = kw.pop('chain')

        # First try to get an existing client by ID
        self.client_id = kw.pop('client_id', None)
        if self.client_id:
            client_data = self.storage.get_client_by_id(self.client_id)

            # If ID is specified then we raise exception if client isn't
            # found.
            if client_data is None:
                raise StorageNotFound('Client not found')

        # Next try to get an existing client by IP and protocol
        self.ip_address = kw.pop('ip_address')
        self.protocol = kw.pop('protocol')

        if self.ip_address and self.protocol:
            client_data = self.storage.get_client(
                self.ip_address,
                self.protocol
            )

        if client_data:
            self.load_client(client_data)
        else:
            self.client_id = str(uuid4())
            self.created = datetime.now()
            self.enabled = False
            self.last_packets = 0
            self.last_activity = None


    def load_client(self, data):
        self.client_id = data.get('client_id')
        self.created = data.get('created')
        self.ip_address = data.get('ip_address')
        self.protocol = data.get('protocol')
        self.enabled = data.get('enabled')
        self.last_packets = data.get('last_packets')
        self.last_activity = data.get('last_activity')


    def commit(self):
        self.commit_client()
        #self.commit_rule()


    def commit_client(self):
        self.storage.write_client(
            self
        )


    def delete(self):
        #self.remove_rule()
        self.storage.remove_client(self)


    def find_rule(self):
        raise NotImplemented


    def commit_rule(self):
        table = iptc.Table(iptc.Table.MANGLE)
        chain = iptc.Chain(table, self.chain)

        # Check if rule exists
        for rule in chain.rules:
            src_ip = rule.src
            if src_ip.startswith(self.ip_address) and rule.protocol == self.protocol:
                print('Rule exists')
                break
        else:
            rule = iptc.Rule()
            rule.src = self.ip_address
            rule.protocol = self.protocol
            rule.target = iptc.Target(rule, 'RETURN')
            chain.insert_rule(rule)

