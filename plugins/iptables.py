# Add an iptables rule

from logging import getLogger, DEBUG, WARN, INFO
from portal import logHandler, logFormatter

# Try to import arping for mac_from_ip(), otherwise use just the client IP.
only_ip = False
try:
    from sh import arping
except ImportError:
    only_ip = True
    pass


def run(arg):
    environ = arg['environ']

    l = getLogger('plugin_logging')
    l.addHandler(logHandler)
    l.setLevel(DEBUG)

    client_ip = environ.get('REMOTE_ADDR')
    if only_ip:
        if not client_ip:
            return {
                'error': 'Unknown client IP',
                'status': False
            }
    else:
        client_mac = mac_from_ip(client_ip)


# Try to get the mac address from the IP. Requires arping installed.
def mac_from_ip(ip):
    return
