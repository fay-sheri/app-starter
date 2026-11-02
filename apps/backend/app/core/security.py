from datetime import datetime, timedelta, timezone
import base64

from jose import JWTError, jwt
from passlib.context import CryptContext

from cryptography.hazmat.primitives import hashes,serialization
from cryptography.hazmat.primitives.asymmetric import padding

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ========================1.哈希加密(数据库)===============================
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
# ========================2. RSA 加密解密(登入注册)=========================
def decrypt_password(encrypted_password: str) -> str:
    """
    解密前端通过 RSA-OAEP + SHA-256 加密并转为 Base64 的密码
    """
    private_key_pem = settings.RSA_PRIVATE_KEY.replace("\\n","\n")

    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
        password=None
    )

    encrypted_data = base64.b64decode(encrypted_password)

    decrypted_data = private_key.decrypt(
        encrypted_data,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    return decrypted_data.decode('utf-8')

# ====================== 3. JWT Token 签发与解析 =================
def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {"sub": subject, "exp": expire}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        raise ValueError("invalid token") from exc