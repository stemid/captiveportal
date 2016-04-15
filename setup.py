from setuptools import setup, find_packages

setup(
    name="CaptivePortal",
    version="0.1",
    description="Captive Portal webpage",
    author="Stefan Midjich",
    packages=find_packages(),
    install_requires=[
        'rq',
        'bottle'
    ]
)
