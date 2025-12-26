import os
import logging
from parsers.poalim import parse_transaction as poalim
from parsers.leumi import parse_transaction as leumi
from parsers.marcentile import parse_transaction as marcentile
from parsers.credit_card import parse as credit_card
from parsers.exceptions import ParsingException
from werkzeug.utils import secure_filename

from . import exceptions
from .upload_file import UPLOAD_FOLDER
import traceback

logger = logging.getLogger(__name__)

def process_file(filename, type):
    if type not in 'poalim leumi marcentile credit'.split():
        raise exceptions.InvalidParameterException('type')

    safe_name = secure_filename(filename)
    if not filename or not safe_name:
        raise exceptions.InvalidParameterException('filename')

    filepath = os.path.join(UPLOAD_FOLDER, safe_name)
    if not os.path.exists(filepath):
        raise exceptions.InvalidParameterException('filename')
    logger.info(f"Processing file: {safe_name} with parser: {type}")
    try:
        report = {"poalim": poalim,
                  "leumi": leumi,
                  "marcentile": marcentile,
                  "credit": credit_card}[type](filepath)
    except Exception as e:
        error_traceback = traceback.format_exc()
        logger.error(
            f"Parser '{type}' failed for file '{safe_name}'\n"
            f"  Error type: {type(e).__name__}\n"
            f"  Error message: {e}\n"
            f"  Traceback:\n{error_traceback}"
        )
        raise ParsingException from e
    
    transactions_count = len(report)
    logger.info(f"Parser '{type}' successfully processed {transactions_count} transactions from '{safe_name}'")

    return {
        "message": "File processed successfully",
        "report": report
    }
