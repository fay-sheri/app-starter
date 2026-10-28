from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash("test123")
print("hash:", hashed)
print("verify:", pwd_context.verify("test123", hashed))
print("wrong:", pwd_context.verify("wrong", hashed))