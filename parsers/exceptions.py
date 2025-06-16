class ParsingException(Exception):
    def __init__(self, message=None):
        self.message = message or f"Parsing exception"
        super().__init__(self.message)
