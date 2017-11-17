
import subprocess
import shlex

def run_ipset(command, *args, **kw):
    use_sudo = kw.get('use_sudo', True)
    timeout = kw.get('timeout', 2)

    if use_sudo:
        ipset_cmd = 'sudo ipset'
    else:
        ipset_cmd = 'ipset'

    full_command = '{ipset} {command} {args}'.format(
        ipset=ipset_cmd,
        command=command,
        args=' '.join(args)
    )

    output = subprocess.check_output(
        shlex.split(full_command),
        timeout=timeout
    )

    return output