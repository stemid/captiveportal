from configparser import RawConfigParser
from logging import Formatter, getLogger, DEBUG, WARN, INFO
from logging.handlers import SysLogHandler, RotatingFileHandler

import pkg_resources
from bottle import route, run, default_app
from bottle import request, template, static_file

config = RawConfigParser()
config.readfp(open('./portal.cfg'))
config.read(['/etc/captiveportal/portal.cfg', './portal_local.cfg'])

# Setup logging
formatter = Formatter(config.get('logging', 'log_format'))
l = getLogger('captiveportal')
if config.get('logging', 'log_handler') == 'syslog':
    syslog_address = config.get('logging', 'syslog_address')

    if syslog_address.startswith('/'):
        h = SysLogHandler(
            address=syslog_address,
            facility=SysLogHandler.LOG_LOCAL0
        )
    else:
        h = SysLogHandler(
            address=(
                config.get('logging', 'syslog_address'),
                config.getint('logging', 'syslog_port')
            ),
            facility=SysLogHandler.LOG_LOCAL0
        )
else:
    h = RotatingFileHandler(
        config.get('logging', 'log_file'),
        maxBytes=config.getint('logging', 'log_max_bytes'),
        backupCount=config.getint('logging', 'log_max_copies')
    )
h.setFormatter(formatter)
l.addHandler(h)

if config.get('logging', 'log_debug'):
    l.setLevel(DEBUG)
else:
    l.setLevel(WARN)

@route('/')
def portalindex():
    return template('portalindex')

@route('/static/<path:path>')
def server_static(path):
    return static_file(path, root='./static')

@route('/approve', method='POST')
def approve_client():
    _dispatch_plugins(request)

    # TODO: return job ID
    # Maybe use the client IP as job ID to enable easier lookups of the job
    # status.
    return

def _dispatch_plugins(request):
    for entrypoint in pkg_resources.iter_entry_points('portal.plugins'):
        l.debug('Loading entry point {point}'.format(
            point=entrypoint.name
        ))

        plugin_class = entrypoint.load()
        plugin_name = entrypoint.name

        plugin_log = getLogger('portal_'+plugin_name)
        plugin_log.addHandler(h)
        plugin_log.setLevel(DEBUG)

        # Instantiate the plugin class
        try:
            inst = plugin_class(
                request=request,
                config=config,
                log=plugin_log
            )
        except Exception as e:
            l.error('{plugin}: {exception}'.format(
                plugin=plugin_name,
                exception=str(e)
            ))
            continue

        # Run plugin.run() method
        try:
            inst.run()
        except Exception as e:
            l.error('{plugin}: {exception}'.format(
                plugin=plugin_name,
                exception=str(e)
            ))
            continue


if __name__ == '__main__':
    run(
        host=config.get('portal', 'listen_host'),
        port=config.getint('portal', 'listen_port')
    )
    debug(config.getbool('portal', 'debug'))
else:
    application = default_app()
