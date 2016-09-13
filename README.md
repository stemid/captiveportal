# Captive Portal

Captive portal webpage written with simplicity in mind. 

  - Present a webpage to the user
  - User submits a form
  - Plugins are executed with form data
  - User is granted access to whatever treasure the portal is guarding

This is a commonly seen setup in public Wifi networks or hotspots. 

This app was specifically written for such a hotspot and as such requires a lot of other configuration around it. This is an ongoing [documentation project here](http://wiki.sydit.se/teknik:guider:captive_portal_med_iptables).

# Plugins

Plugins are executed when the user clicks through the captive portal form, whether they submit data or just approve an EULA these plugins are executed. 

Plugins accept data from the request of the user, as of writing this is only wsgi environ data. 

Result of the plugins decide whether the user gets accepted into the portal or not. As such plugins have the potential to do anything from check the users IP against a whitelist to authenticate against a RADIUS server or Active Directory.

Sample plugins prefixed with sample\_ are a good starting point for understanding the plugins. 

Plugins can be made mandatory, or skipped by being disabled, see plugins.cfg for more configuration.

## Why plugins, why job queue?

My primary use case for this portal would be with tens of thousands of users so already I imagined that creating firewall rules would be a blocking action. 

Also with plugins there are options to connect other authentication methods like LDAP or RADIUS, and even other actions to the portal. All of which are possibly blocking. So plugins and job queues felt like a necessary technology to use. Otherwise this type of portal could be a very simple CGI script that runs a system() command.

# Get started

    python setup.py install
    python portal.py

## RQ worker

    rq worker -u redis://127.0.0.1:6379/

# Deployment

See examples in docs/examples directory.
