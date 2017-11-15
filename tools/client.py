"""
Handles "clients" in IPtables for captive portal.
"""

import ipaddress
from uuid import uuid4
from datetime import datetime, timedelta

from errors import StorageNotFound, IPTCRuleNotFound
from helpers import run_ipset


class Client(object):

    def __init__(self, **kw):
        # Required parameters
        self.storage = kw.pop('storage')
        self.ipset_name = kw.pop('ipset_name')
        
        self.ip_address = kw.pop('ip_address', '127.0.0.1')
        self.protocol = kw.pop('protocol', 'tcp')

        self.new = False

        # First try to get an existing client by ID
        self.client_id = kw.pop('client_id', None)
        if self.client_id:
            client_data = self.storage.get_client_by_id(self.client_id)

            # If ID is specified then we raise exception if client isn't
            # found.
            if client_data is None:
                raise StorageNotFound('Client not found')
        else:
            client_data = self.storage.get_client(
                self._ip_address,
                self.protocol
            )

        # Init iptables
        #self.table = iptc.Table(iptc.Table.MANGLE)
        #self.chain = iptc.Chain(self.table, self._chain)

        if client_data:
            self.load_client(client_data)
        else:
            self.client_id = str(uuid4())
            self.created = datetime.now()
            self.enabled = False
            self.last_packets = 0
            self.last_activity = None
            self.expires = datetime.now() + timedelta(days=1)
            self.new = True


    def load_client(self, data):
        self.client_id = data.get('client_id')
        self.created = data.get('created')
        self.ip_address = data.get('ip_address')
        self.protocol = data.get('protocol')
        self.enabled = data.get('enabled')
        self.last_packets = data.get('last_packets')
        self.last_activity = data.get('last_activity')
        self.expires = data.get('expires')


    def commit(self):
        self.commit_client()

        if self.enabled:
            self.commit_rule()
        else:
            self.remove_rule()


    def commit_client(self):
        self.storage.write_client(
            self
        )


    def delete(self):
        self.remove_rule()
        self.storage.remove_client(self)


    def remove_rule(self):
        run_ipset(
            'del',
            '-exist',
            self.ipset_name,
            self.ip_address
        )


    def commit_rule(self):
        run_ipset(
            'add',
            '-exist',
            self.ipset_name,
            self.ip_address
        )


    @property
    def ip_address(self):
        return str(self._ip_address.ip)


    @ip_address.setter
    def ip_address(self, value):
        if isinstance(value, str):
            self._ip_address = ipaddress.IPv4Interface(value)
        elif isinstance(value, ipaddress.IPv4Interface):
            self._ip_address = value
        else:
            raise ValueError('Cannot set invalid value')


