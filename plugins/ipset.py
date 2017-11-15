# Add client IP into ipset

import re
import socket
import subprocess
import shlex
from io import BytesIO, StringIO
from logging import getLogger, DEBUG, WARN, INFO
from datetime import datetime

try:
    from configparser import RawConfigParser
except ImportError:
    from ConfigParser import RawConfigParser

# By default run ipset through sudo, so the worker process must run with
# a user that is allowed to execute '/sbin/ipset add' command with NOPASSWD.
#from sh import sudo, Command, ErrorReturnCode

from portal import logHandler, logFormatter


def run(arg):
    # Some info from the plugin dispatcher.
    environ = arg['environ']
    plugin_config = arg['config']

    config = RawConfigParser(defaults=plugin_config)
    config.add_section('ipset')
    config._sections['ipset'] = plugin_config

    # Setup plugin logging
    l = getLogger('plugin_ipset')
    l.addHandler(logHandler)
    if config.getboolean('ipset', 'debug'):
        l.setLevel(DEBUG)
        l.debug('debug logging enabled')

    # Get client IP from webapp, try HTTP_X_FORWARDED_FOR and fallback on
    # REMOTE_ADDR.
    client_ip = environ.get(
        'HTTP_X_FORWARDED_FOR',
        environ.get('REMOTE_ADDR')
    )
    error_msg = None
    plugin_failed = True
    start_time = datetime.now()

    # Verify client IP
    try:
        socket.inet_aton(client_ip)
    except socket.error:
        l.error('Client IP-address is invalid')
        return {
            'error': str(e),
            'failed': True
        }

    ipset_name = config.get('ipset', 'ipset_name')
    use_sudo = config.getboolean('ipset', 'use_sudo')
    #output, error = StringIO(), StringIO()

    if client_ip:
        ipset_cmd = config.get(
            'ipset',
            'ipset_add_cmd'
        ).format(
            client_ip=client_ip
        )

        proc = subprocess.Popen(
            shlex.split(ipset_cmd)
        )

        try:
            (output, error) = proc.communicate(timeout=2)

        except Exception as e:
            error_msg = str(e)
            l.warn('{cmd}: failed call: {error}'.format(
                cmd=ipset_cmd,
                error=str(e)
            ))
            raise

        end_time = datetime.now()

        if proc.returncode == 0:
            l.info('Added ip:"{ip}" to set:"{set}" in "{duration}": {stdout}'.format(
                ip=client_ip,
                set=ipset_name,
                duration=end_time-start_time,
                stdout=output
            ))
            plugin_failed = False
        else:
            l.warn('{cmd}: failed[{ret}] in "{duration}": {stderr}'.format(
                cmd=ipset_cmd,
                ret=proc.returncode,
                duration=end_time-start_time,
                stderr=error
            ))
            raise Exception('Plugin failed')

    else:
        l.info('No client IP, no action taken')
        error_msg = 'No client IP'
        raise Exception('Plugin failed')

    return {
        'error': error_msg,
        'failed': plugin_failed
    }
