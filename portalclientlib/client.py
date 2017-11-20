"""
Handles "clients" in IPtables for captive portal.
"""

import ipaddress
from uuid import uuid4
from datetime import datetime, timedelta

from portalclientlib import errors
from portalclientlib.helpers import run_ipset


class Client(object):

    def __init__(self, **kw):
        # Required parameters
        self.storage = kw.pop('storage')
        self.ipset_name = kw.pop('ipset_name')
        self.use_sudo = kw.pop('use_sudo', False)

        # Default attribute values
        self.ip_address = kw.pop('ip_address', '127.0.0.1')
        self.protocol = kw.pop('protocol', 'tcp')

        self._enabled = False
        self._last_packets = 0
        self._last_activity = None
        self._expires = datetime.now() + timedelta(days=1)

        self._new = False
        self._commit = False

        # First try to get an existing client by ID
        self.client_id = kw.pop('client_id', None)
        if self.client_id:
            client_data = self.storage.get_client_by_id(self.client_id)

            # If ID is specified then we raise exception if client isn't
            # found.
            if client_data is None:
                raise errors.StorageNotFound('Client not found')
        else:
            client_data = self.storage.get_client(
                self._ip_address
            )

        # Init iptables
        #self.table = iptc.Table(iptc.Table.MANGLE)
        #self.chain = iptc.Chain(self.table, self._chain)

        if client_data:
            self.load_client(client_data)
        else:
            # Creating a new client, not yet comitted.
            self.client_id = str(uuid4())
            self.created = datetime.now()

            self._new = True
            self._commit = True


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
        if not self._commit:
            return False

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
            self.ip_address,
            use_sudo=self.use_sudo
        )


    def commit_rule(self):
        run_ipset(
            'add',
            '-exist',
            self.ipset_name,
            self.ip_address,
            use_sudo=self.use_sudo
        )


    @property
    def enabled(self):
        return self._enabled

    @enabled.setter
    def enabled(self, value):
        if not isinstance(value, bool):
            return False

        if value != self.enabled:
            self._commit = True
            self._enabled = value


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


    @property
    def last_activity(self):
        return self._last_activity

    @last_activity.setter
    def last_activity(self, value):
        if not isinstance(value, datetime):
            return False

        if value != self.last_activity:
            self._commit = True
            self._last_activity = value


    @property
    def last_packets(self):
        return self._last_packets

    @last_packets.setter
    def last_packets(self, value):
        if value != self.last_packets:
            self._commit = True
            self._last_packets = int(value)


    @property
    def expires(self):
        return self._expires

    @expires.setter
    def expires(self, value):
        if not isinstance(value, datetime):
            return False

        if value != self.expires:
            self._commit = True
            self._expires = value
