from pydantic import BaseModel, EmailStr

class Register_WithoutEmail(BaseModel):
    username: str
    password: str

class TokenRequest(BaseModel):
    refresh_token: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True