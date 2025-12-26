import logging
from flask import Flask, request, jsonify
import rpc
import parsers

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

def jsonrpc_success(result, id):
    return jsonify({"jsonrpc": "2.0", "result": result, "id": id})

def jsonrpc_error(code, message, id=None):
    return jsonify({"jsonrpc": "2.0", "error": {"code": code, "message": message}, "id": id})

@app.route('/api', methods=['POST'])
def handle_rpc():
    try:
        data = request.get_json(force=True)
    except Exception:
        logger.warning("Failed to parse JSON request")
        return jsonrpc_error(-32700, "Parse error", None), 400
    
    method = data.get("method")
    rpc_id = data.get("id")
    params = data.get("params", {})

    logger.info(f"RPC request: method={method}, id={rpc_id}")

    if method not in rpc.methods:
        logger.warning(f"Method not found: {method}")
        return jsonrpc_error(-32601, "Method not found", rpc_id), 400

    if not isinstance(data, dict) or data.get("jsonrpc") != "2.0":
        return jsonrpc_error(-32600, "Invalid Request", data.get("id")), 400

    try: 
        try:
            ret = rpc.methods[method](**params)
        except TypeError as e:
            raise rpc.exceptions.MissingParameterException(', '.join(e.args))
        
        logger.info(f"RPC request successful: method={method}, id={rpc_id}")
        return jsonrpc_success(
            ret,
            rpc_id)
    except parsers.ParsingException as e:
        logger.error(f"Parsing error: {e.message}")
        return jsonrpc_error(
            -32000,
            e.message,
            rpc_id
        ), 400
    except rpc.RPCException as e:
        logger.error(f"RPC error: code={e.code}, message={e.message}")
        return jsonrpc_error(
            e.code,
            e.message,
            rpc_id
        ), 400

if __name__ == '__main__':
    app.run(debug=True)
