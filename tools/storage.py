"""
Database storage backends for client.py.
"""

import json
from datetime import datetime

import psycopg2
from redis import Redis


class StoragePostgres(object):

    def __init__(self, **kw):
        config = kw.pop('config')

        self.conn = psycopg2.connect(
            host=config.get('postgres', 'hostname'),
            user=config.get('postgres', 'username'),
            password=config.get('postgres', 'password'),
            dbname=config.get('postgres', 'database'),
            port=config.getint('postgres', 'port')
        )


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
