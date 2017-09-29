"""
Database storage backends for client.py.
"""

import json
from datetime import datetime

import psycopg2
from psycopg2.extras import DictCursor, register_ipaddress, Inet
from redis import Redis

from client import Client


class StoragePostgres(object):
    """
    This requires python 3 for inet data type.
    """

    def __init__(self, **kw):
        config = kw.pop('config')

        self.conn = psycopg2.connect(
            host=config.get('postgres', 'hostname'),
            user=config.get('postgres', 'username'),
            password=config.get('postgres', 'password'),
            dbname=config.get('postgres', 'database'),
            port=config.getint('postgres', 'port'),
            sslmode='disable',
            cursor_factory=DictCursor
        )
        self.cur = self.conn.cursor()
        register_ipaddress()
    

    def client_ids(self):
        self.cur.execute(
            'select client_id from client'
        )
        return self.cur


    def get_client_by_id(self, client_id):
        self.cur.execute(
            'select * from client where client_id=%s',
            (client_id,)
        )
        return self.cur.fetchone()


    def get_client(self, ip_address, protocol):
        """
        Expects an ipaddress.IPv4Interface as ip_address argument.
        """

        self.cur.execute(
            'select * from client where ip_address=%s and protocol=%s',
            (ip_address, protocol, )
        )
        return self.cur.fetchone()


    def write_client(self, client):
        query = (
            'insert into client (client_id, created, ip_address, protocol, '
            'enabled, last_packets, last_activity, expires) values '
            '(%s, %s, %s, %s, %s, %s, %s, %s) on conflict (client_id, '
            'ip_address, protocol) do update set (enabled, last_packets, '
            'last_activity, expires) = (EXCLUDED.enabled, EXCLUDED.last_packets, '
            'EXCLUDED.last_activity, EXCLUDED.expires)'
        )
        self.cur.execute(
            query,
            (
                client.client_id,
                client.created,
                client.ip_address,
                client.protocol,
                client.enabled,
                client.last_packets,
                client.last_activity,
                client.expires
            )
        )
        self.conn.commit()


    def remove_client(self, client):
        query = 'delete from client where client_id=%s'
        self.cur.execute(query, (client.client_id,))
        self.conn.commit()


class DateTimeEncoder(json.JSONEncoder):
    """
    json.JSONEncoder sub-class that converts all datetime objects to
    epoch timestamp integer values.
    """
    def default(self, o):
        if isinstance(o, datetime):
            return int(o.strftime('%s'))
        return json.JSONEncoder.default(self, o)


class StorageRedis(object):
    """
    Note: Abandoned this storage backend for Postgres.
    """

    def __init__(self, **kw):
        config = kw.pop('config')

        self.r = Redis(
            host=config.get('redis', 'hostname'),
            port=config.getint('redis', 'port'),
            db=config.getint('redis', 'db')
        )

    
    def add_client(self, client_id, **kw):
        raise NotImplemented
