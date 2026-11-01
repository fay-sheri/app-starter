/**
 * 
 * 算法：RSA-OAEP + SHA-256
 */

// 1. PEM 公钥 -> Web Crypto CryptoKey
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s/g, '')

  const bin = atob(b64)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buf[i] = bin.charCodeAt(i)
  }
  return buf.buffer
}

async function importPublicKey(pem: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(pem),
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  )
}

// 2. ArrayBuffer -> base64（安全写法，避免大数组爆栈）js引擎参数限制
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i])
  }
  return btoa(bin)
}

// 3. 对外暴露：加密明文密码
export async function encryptPassword(
  plainText: string,
  publicKeyPem: string
): Promise<string> {
  const publicKey = await importPublicKey(publicKeyPem)

  const encrypted = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    new TextEncoder().encode(plainText)
  )

  return arrayBufferToBase64(encrypted)
}