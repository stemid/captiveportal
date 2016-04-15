# Captive Portal

Work in progress right now. 

Captive portal webpage written with simplicity in mind. 

  - Present a webpage to the user
  - Users submits a form
  - Plugins are executed with form data
  - User is granted access to whatever treasure the portal is guarding

This is a commonly seen setup in public Wifi networks or hotspots. 

This app was specifically written for such a hotspot and as such requires a lot of other configuration around it. This is an ongoing [documentation project here](http://wiki.sydit.se/teknik:guider:captive_portal_med_iptables).

# Plugins

Plugins are executed when the user clicks through the captive portal form, whether they submit data or just approve an EULA these plugins are executed. 

Plugins accept data from the request of the user, as of writing this is only wsgi environ data. 

There is a sample plugin called logging.py. Plugins are merely rq jobs that are executed by an rq worker. As such they can only be so complex.

# RQ worker

    rq worker -u redis://127.0.0.1:6379/
