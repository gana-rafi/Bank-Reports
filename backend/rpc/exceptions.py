class RPCException(Exception):
    def __init__(self,code, message=None):
        self.code = code
        self.message = message or f"RPC Exception: '{code}'"
        super().__init__(self.message)


class MissingParameterException(RPCException):
    def __init__(self, message=None):
        self.message = message
        super().__init__(-32602, self.message)


class InvalidParameterException(RPCException):
    def __init__(self, parameter_name, message=None):
        self.parameter_name = parameter_name
        self.message = message or f"Invalid or empty parameter: '{parameter_name}'"
        super().__init__(-32602, self.message)


class IntegrityCheckFailedException(RPCException):
    def __init__(self, expected, actual, message=None):
        self.expected = expected
        self.actual = actual
        self.message = message or f"Integrity check mismatch. Expected {expected}, got {actual}"
        super().__init__(-32001, self.message)
