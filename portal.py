# Captiveportal web application using Bottle.py

import json
from pprint import pprint
from importlib import import_module
from configparser import RawConfigParser
from logging import Formatter, getLogger, DEBUG, WARN, INFO
from logging.handlers import SysLogHandler, RotatingFileHandler

from redis import Redis
from rq import Queue
from bottle import route, run, default_app
from bottle import request, response, template, static_file

config = RawConfigParser()
config.readfp(open('./portal.cfg'))
config.read(['/etc/captiveportal/portal.cfg', './portal_local.cfg'])

# Plugins configuration is separate so plugins can be disabled by having
# their section removed/commented from the config file.
plugin_config = RawConfigParser()
plugin_config.readfp(open('./plugins.cfg'))
plugin_config.read(['/etc/captiveportal/plugins.cfg'])

# Setup logging
logFormatter = Formatter(config.get('logging', 'log_format'))
l = getLogger('captiveportal')
if config.get('logging', 'log_handler') == 'syslog':
    syslog_address = config.get('logging', 'syslog_address')

    if syslog_address.startswith('/'):
        logHandler = SysLogHandler(
            address=syslog_address,
            facility=SysLogHandler.LOG_LOCAL0
        )
    else:
        logHandler = SysLogHandler(
            address=(
                config.get('logging', 'syslog_address'),
                config.getint('logging', 'syslog_port')
            ),
            facility=SysLogHandler.LOG_LOCAL0
        )
else:
    logHandler = RotatingFileHandler(
        config.get('logging', 'log_file'),
        maxBytes=config.getint('logging', 'log_max_bytes'),
        backupCount=config.getint('logging', 'log_max_copies')
    )
logHandler.setFormatter(logFormatter)
l.addHandler(logHandler)

if config.get('logging', 'log_debug'):
    l.setLevel(DEBUG)
else:
    l.setLevel(WARN)

# Redis Queue
R = Redis(
    host=config.get('portal', 'redis_host'),
    port=config.getint('portal', 'redis_port')
)


@route('/')
def portalindex():
    return template('portalindex')


@route('/static/<path:path>')
def server_static(path):
    return static_file(path, root='./static')


@route('/approve', method='POST')
def approve_client():
    response.content_type = 'application/json'
    jobs = dispatch_plugins()

    # TODO: return job ID
    # Maybe use the client IP as job ID to enable easier lookups of the job
    # status.
    return json.dumps(jobs)


# Add plugins to job queue
def dispatch_plugins():
    Q = Queue(connection=R)
    jobs = []

    for plugin in plugin_config.sections():
        l.debug('Loading plugin {plugin}'.format(
            plugin=plugin
        ))

        arg = {}

        # Import some values from WSGI environ
        arg['environ'] = {}
        for key in request.environ:
            value = request.environ.get(key)
            if isinstance(value, (int, str, float, dict, set, tuple)):
                arg['environ'][key] = value

        plugin_module = import_module('plugins.'+plugin)
        try:
            plugin_job = Q.enqueue(
                plugin_module.run,
                arg
            )
        except Exception as e:
            l.error('{plugin}: {error}'.format(
                error=str(e),
                plugin=plugin
            ))
            continue

        jobs.append(plugin_job)


if __name__ == '__main__':
    run(
        host=config.get('portal', 'listen_host'),
        port=config.getint('portal', 'listen_port')
    )
    debug(config.getbool('portal', 'debug'))
else:
    application = default_app()
