import os
import hashlib
import base64
from werkzeug.utils import secure_filename
from . import exceptions


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_suffixed_filename(path):
    base, ext = os.path.splitext(path)
    i = 1
    new_path = f"{base}_{i}{ext}"
    while os.path.exists(new_path):
        i += 1
        new_path = f"{base}_{i}{ext}"
    return new_path

def upload_file(filename, content, metadata = None, conflict='error'):
    if metadata is None:
        metadata = {}

    safe_name = secure_filename(filename)
    if not filename or not safe_name:
        raise exceptions.InvalidParameterException('filename')
    filepath = os.path.join(UPLOAD_FOLDER, safe_name)

    if not content:
        raise exceptions.InvalidParameterException('content')
    try:
        file_bytes = base64.b64decode(content)
    except Exception:
        raise exceptions.InvalidParameterException('content')

    # Validate hash
    sha256_expected = metadata.get("sha256")
    if sha256_expected:
        sha256_actual = hashlib.sha256(file_bytes).hexdigest()
        if sha256_actual != sha256_expected:
            raise exceptions.IntegrityCheckFailedException(sha256_expected, sha256_actual)
    else:
        raise exceptions.MissingParameterException("upload_file Missing 1 required argument: 'metadata.sha256S'")

    # Handle file path and conflict mode
    file_exists = os.path.exists(filepath)
    mop = 'wb'
    
    if file_exists:
        if conflict == "error":
            raise exceptions.RPCException( -32002, "File already exists")
        elif conflict == "ignore":
            return {"message": "File exists, not overwritten", "filename": filename}
        elif conflict == "suffix":
            filepath = get_suffixed_filename(filepath)
        elif conflict == "append":
            mop = 'ab'
            with open(filepath, 'ab') as f:
                f.write(file_bytes)
            return {"message": "Content appended", "filename": os.path.basename(filepath)}
        elif conflict == "overwrite":
            pass  # Will overwrite below
        else:
            raise exceptions.InvalidParameterException('conflict')

    with open(filepath, mop) as f:
        f.write(file_bytes)

    return {
        "message": "File saved successfully",
        "filename": os.path.basename(filepath)
    }
