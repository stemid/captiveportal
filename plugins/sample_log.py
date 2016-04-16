# Demonstration plugin, only logs a message.

# Sets up logging by importing from the bottle app in the parent dir.
from logging import getLogger, DEBUG, WARN, INFO
from portal import logHandler, logFormatter

def run(arg):
    # The WSGI environ dict should always be there, sans any special objects
    # like io streams.
    environ = arg['environ']

    l = getLogger('plugin_log')
    l.addHandler(logHandler)
    l.setLevel(DEBUG)

    log_url = '{proto}://{server}:{port}{request}'.format(
        proto=environ.get('wsgi.url_scheme'),
        server=environ.get('SERVER_NAME'),
        port=environ.get('SERVER_PORT'),
        request=environ.get('PATH_INFO')
    )

    log_client = '{client_ip}'.format(
        client_ip=environ.get(
            'HTTP_X_FORWARDED_FOR',
            environ.get('REMOTE_ADDR')
        )
    )

    # Log a msg
    l.info('{log_client} - {method} - {log_url}'.format(
        log_client=log_client,
        log_url=log_url,
        method=environ.get('REQUEST_METHOD')
    ))
