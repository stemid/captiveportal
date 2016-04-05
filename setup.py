from setuptools import setup, find_packages

try:
    plugins = open('/etc/captiveportal/plugins.cfg')
except:
    plugins = open('./plugins.cfg')

setup(
    name="CaptivePortal",
    version="0.1",
    description="Captive Portal webpage",
    author="Stefan Midjich",
    packages=find_packages(),
    entry_points=plugins.read()
)
