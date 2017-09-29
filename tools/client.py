"""
Handles "clients" in IPtables for captive portal.
"""

import ipaddress
from uuid import uuid4
from datetime import datetime, timedelta

import iptc

from errors import StorageNotFound, IPTCRuleNotFound


class Client(object):

    def __init__(self, **kw):
        # Required parameters
        self.storage = kw.pop('storage')
        self._chain = kw.pop('chain')
        
        self.ip_address = kw.pop('ip_address', '127.0.0.1')
        self.protocol = kw.pop('protocol', 'tcp')

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
        self.table = iptc.Table(iptc.Table.MANGLE)
        self.chain = iptc.Chain(self.table, self._chain)

        if client_data:
            self.load_client(client_data)
        else:
            self.client_id = str(uuid4())
            self.created = datetime.now()
            self.enabled = False
            self.last_packets = 0
            self.last_activity = None
            self.expires = datetime.now() + timedelta(days=1)


    def load_client(self, data):
        self.client_id = data.get('client_id')
        self.created = data.get('created')
        self.ip_address = data.get('ip_address')
        self.protocol = data.get('protocol')
        self.enabled = data.get('enabled')
        self.last_packets = data.get('last_packets')
        self.last_activity = data.get('last_activity')
        self.expires = data.get('expires')

        # Try and find a rule for this client and with that rule also packet
        # count. Don't rely on it existing though.
        rule = None
        try:
            rule = self.find_rule(self._ip_address, self.protocol)
        except Exception as e:
            # TODO: This should raise an exception and be handled further up
            # the stack by logging the error.
            raise
            #raise IPTCRuleNotFound(
            #    'Could not find the iptables rule for {client_ip}'.format(
            #        client_ip=self.ip_address
            #    )
            #)

        if rule:
            (packet_count, byte_count) = rule.get_counters()

            if self.last_packets < packet_count:
                self.last_activity = datetime.now()
                self.last_packets = packet_count


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
        rule = self.find_rule(self._ip_address, self.protocol)
        if rule:
            self.chain.delete_rule(rule)


    def find_rule(self, ip_address, protocol):
        """
        Takes an ipaddress.IPv4Interface object as ip_address argument.
        """

        if not isinstance(ip_address, ipaddress.IPv4Interface):
            raise ValueError('Invalid argument type')

        for rule in self.chain.rules:
            src_ip = rule.src

            try:
                _ip = str(ip_address.ip)
            except:
                # If we can't understand the argument just return None
                return None

            if src_ip.startswith(_ip) and rule.protocol == protocol:
                return rule
        else:
            return None


    def commit_rule(self):
        rule = self.find_rule(self._ip_address, self.protocol)
        if not rule:
            rule = iptc.Rule()
            rule.src = self.ip_address
            rule.protocol = self.protocol
            rule.target = iptc.Target(rule, 'RETURN')
            self.chain.insert_rule(rule)


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


