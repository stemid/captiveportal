# Client tools

These tools deal with clients in IPtables backed by a PostgreSQL database.

A class is defined in client.py that handles creating and looking up clients.

## Examples

As of writing manage\_client.py uses the plugins.cfg configuration to keep the number of config files down.

So the portalclient plugin and the postgres plugin sections are borrowed by this tool.