"""
Handles "clients" in IPtables for captive portal.
"""

from datetime import datetime

#import iptc


class Client(object):

    def __init__(self, **kw):
        self.storage = kw.pop('storage')
        self.client_id = kw.pop('client_id')
        self.protocol = kw.pop('protocol')
        self.chain = kw.pop('chain')

        # Default values for client data
        self.data = {
            'client_id': self.client_id,
            'protocol': self.protocol,
            'created': datetime.now(),
            'bytes': 0,
            'packets': 0,
            'last_activity': None
        }

        self.client_exists = False

        # Attempt to fetch client from storage
        client_data = self.storage.get_client(self.client_id)
        if client_data:
            self.data = client_data
            self.exists = True


    def commit(self):
        self.commit_client()
        #self.commit_rule()


    def commit_client(self):
        if self.exists:
            self.storage.update_client(
                self.client_id,
                **self.data
            )
        else:
            self.storage.add_client(
                self.client_id,
                **self.data
            )

    def commit_rule(self):
        table = iptc.Table(iptc.Table.MANGLE)
        chain = iptc.Chain(table, self.chain)

        # Check if rule exists
        for rule in chain.rules:
            src_ip = rule.src
            if src_ip.startswith(self.client_id) and rule.protocol == self.protocol:
                print('Rule exists')
                break
        else:
            rule = iptc.Rule()
            rule.src = self.client_id
            rule.protocol = self.protocol
            rule.target = iptc.Target(rule, 'RETURN')
            chain.insert_rule(rule)
