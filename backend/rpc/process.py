import os
from parsers.poalim import parse_transaction as poalim
from parsers.leumi import parse_transaction as leumi
from parsers.marcentile import parse_transaction as marcentile
from parsers.credit_card import parse as credit_card
from parsers.exceptions import ParsingException
from werkzeug.utils import secure_filename

from . import exceptions
from .upload_file import UPLOAD_FOLDER
import traceback

def process_file(filename, type):
    if type not in 'poalim leumi marcentile credit'.split():
        raise exceptions.InvalidParameterException('type')

    safe_name = secure_filename(filename)
    if not filename or not safe_name:
        raise exceptions.InvalidParameterException('filename')

    filepath = os.path.join(UPLOAD_FOLDER, safe_name)
    if not os.path.exists(filepath):
        raise exceptions.InvalidParameterException('filename')

    try:
        report = {"poalim": poalim,
                  "leumi": leumi,
                  "marcentile": marcentile,
                  "credit": credit_card}[type](filepath)
    except Exception as e:
        print(e)
        traceback.print_exc()
        raise ParsingException from e
    
    return {
        "message": "File processed successfully",
        "report": report
    }
