# Sample plugin that fails

def run(arg):
    return {
        'error': 'Always fails',
        'failed': True
    }
