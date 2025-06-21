from .upload_file import upload_file as _upload_file
from .process import process_file as _process_file
from .edit import list_domains as _list_domains
from .exceptions import RPCException

methods = {
    "upload_file": _upload_file,
    "process_file":_process_file,
    "list_domains": _list_domains,
    }

