# Captive Portal

This is supposed to be a captive portal webpage. 

Work in progress right now. 

# Plugins

Plugins are executed when the user clicks through the captive portal form, whether they submit data or just approve an EULA these plugins are executed. 

Plugins accept data from the request of the user, as of writing this is only wsgi environ data. 

There is a sample plugin called logging.py. Plugins are merely rq jobs that are executed by an rq worker. As such they can only be so complex.

# RQ worker

  rq worker -u redis://127.0.0.1:6379/
