"""
Database storage backends for client.py.
"""

import json
from datetime import datetime

from redis import Redis


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

    def __init__(self, **kw):
        config = kw.pop('config')

        self.r = Redis(
            host=config.get('redis', 'hostname'),
            port=config.getint('redis', 'port'),
            db=config.getint('redis', 'db')
        )

    
    def add_client(self, client_id, **kw):
        pass
