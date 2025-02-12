from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST

class CustomError(HTTPException):
    def __init__(self, detail: str, status_code: int = HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)
