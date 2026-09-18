from fastapi import HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

class APIException(HTTPException):
    def __init__(self, status_code: int, code: str, message: str):
        super().__init__(status_code=status_code, detail={"code": code, "message": message})
        self.code = code
        self.message = message

class BadRequestException(APIException):
    def __init__(self, message: str = "Invalid input request", code: str = "BAD_REQUEST"):
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, code=code, message=message)

class UnauthenticatedException(APIException):
    def __init__(self, message: str = "Authentication required", code: str = "UNAUTHENTICATED"):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, code=code, message=message)

class UnauthorizedException(APIException):
    def __init__(self, message: str = "Permission denied for this resource", code: str = "UNAUTHORIZED"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, code=code, message=message)

class NotFoundException(APIException):
    def __init__(self, message: str = "Resource not found", code: str = "RESOURCE_NOT_FOUND"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, code=code, message=message)

class ConflictException(APIException):
    def __init__(self, message: str = "Conflict or invalid state transition", code: str = "INVALID_STATE"):
        super().__init__(status_code=status.HTTP_409_CONFLICT, code=code, message=message)


async def api_exception_handler(request: Request, exc: APIException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.code,
                "message": exc.message
            }
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0]["msg"] if errors else "Invalid input validation"
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "success": False,
            "error": {
                "code": "INVALID_INPUT",
                "message": f"Validation error: {first_msg}"
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    import traceback
    print("=== UNHANDLED EXCEPTION IN FASTAPI ===")
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": f"An unexpected server error occurred: {str(exc)}"
            }
        }
    )
