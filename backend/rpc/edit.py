from editor.domains import Domain

def list_domains():
    """
    RPC method to return all available domains as a list of strings.
    """
    return [d.value for d in Domain if d != Domain.UNSPECIFIED]

# If using a JSON-RPC dispatcher, register the method:
# dispatcher.add_method(list_domains)