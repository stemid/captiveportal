
import subprocess
import shlex

def run_ipset(command, *args, **kw):
    use_sudo = kw.get('use_sudo', True)

    if use_sudo:
        ipset_cmd = 'sudo ipset'
    else:
        ipset_cmd = 'ipset'

    full_command = '{ipset} {command} {args}'.format(
        ipset=ipset_cmd,
        command=command,
        args=' '.join(args)
    )

    proc = subprocess.run(
        shlex.split(full_command),
        stdout=subprocess.PIPE,
        timeout=2,
        check=True
    )

    #proc = subprocess.Popen(
    #    shlex.split(full_command),
    #    stdout=subprocess.PIPE
    #)

    #(output, error) = proc.communicate(timeout=2)

    return proc