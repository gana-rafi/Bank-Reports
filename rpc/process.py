import os
from parsers.poalim import parse_transaction
from parsers.exceptions import ParsingException
from werkzeug.utils import secure_filename

from . import exceptions
from .upload_file import UPLOAD_FOLDER

def process_file(filename, type):
    if type not in 'bank credit'.split():
        raise exceptions.InvalidParameterException('type')

    safe_name = secure_filename(filename)
    if not filename or not safe_name:
        raise exceptions.InvalidParameterException('filename')

    filepath = os.path.join(UPLOAD_FOLDER, safe_name)
    if not os.path.exists(filepath):
        raise exceptions.InvalidParameterException('filename')

    try:
        report = parse_transaction(filepath)
    except Exception as e:
        raise ParsingException from e
    
    return {
        "message": "File processed successfully",
        "report": report
    }
