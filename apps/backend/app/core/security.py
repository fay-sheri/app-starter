from datetime import datetime, timedelta, timezone
import base64

from jose import JWTError, jwt
from passlib.context import CryptContext

from cryptography.hazmat.primitives import hashes,serialization
from cryptography.hazmat.primitives.asymmetric import padding
import re

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


# ====================== 4. 是否RSA-OAEP(SHA-256)加密 ========================
_B64_RE = re.compile(r'^[A-Za-z0-9+/]+={0,2}$')

def is_frontend_rsa_oaep_encrypted(password_field: str, private_key_pem: bytes = settings.RSA_PRIVATE_KEY, expected_plaintext_checker=None) -> bool:
    """
    检测前端传来的 password 字段是否为
    RSA-OAEP(SHA-256) 加密结果（对应前端 crypto.subtle.encrypt({name:'RSA-OAEP'}, ...)）。

    参数:
        password_field: 前端传来的 base64 字符串
        private_key_pem: 后端 RSA 私钥 PEM（bytes）
        expected_plaintext_checker: 可选。解密成功后对明文做进一步校验，
                                    例如 lambda p: 8 <= len(p) <= 64。
                                    返回 False 则整体判 False。

    返回:
        True  = 能用私钥成功 OAEP(SHA-256) 解密（即认为是合法前端加密）
        False = base64 非法 / 长度不对 / OAEP 解码失败 / 明文校验失败
    """
    # 1) 基本类型与 base64 格式检查
    if not isinstance(password_field, str) or not password_field:
        return False
    if len(password_field) % 4 != 0 or not _B64_RE.match(password_field):
        return False

    try:
        ciphertext = base64.b64decode(password_field, validate=True)
    except Exception:
        return False

    # 2) 加载私钥
    try:
        private_key = serialization.load_pem_private_key(private_key_pem, password=None)
    except Exception:
        return False

    # 3) 长度必须等于模长字节数
    key_size_bytes = (private_key.key_size + 7) // 8
    if len(ciphertext) != key_size_bytes:
        return False

    # 4) 尝试 OAEP(SHA-256) 解密 —— 这一步才是真正的“格式校验”
    try:
        plaintext = private_key.decrypt(
            ciphertext,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None,
            ),
        )
    except Exception:
        return False

    # 5) 可选：对解密出的明文做业务校验
    if expected_plaintext_checker is not None:
        try:
            if not expected_plaintext_checker(plaintext):
                return False
        except Exception:
            return False

    return True