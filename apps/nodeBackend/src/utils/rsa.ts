//RSA-OAEP + SHA-256
import crypto from "crypto";
import { AppError } from "../errors/index.js";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error("服务器未配置私钥");
}

export function decryptRSAPassword(encryptedBase64: string): string {
  if (!encryptedBase64 || typeof encryptedBase64 !== "string") {
    throw new AppError(422, 42201, "密码加密参数异常");
  }
  let decrypted: Buffer;
  try {
    decrypted = crypto.privateDecrypt(
      {
        key: PRIVATE_KEY!,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedBase64, "base64"),
    );
  } catch {
    throw new AppError(422, 42201, "密码加密参数异常");
  }
  return decrypted.toString("utf8");
}
