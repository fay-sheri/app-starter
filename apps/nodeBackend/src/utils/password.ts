import argon2 from "argon2";
//内存密集型哈希（要占大量内存+时间）需要异步

export async function hashPassword(password: string): Promise<string> {
  // 默认就是 argon2id，自动造 16 字节随机 salt
  return argon2.hash(password, {
    type: argon2.argon2id, //算法
    memoryCost: 65536, // 64 MiB
    timeCost: 3, //迭代次数
    parallelism: 1, //并行度
  });
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  try {
    // 参数顺序：hash 在前，password 在后
    return await argon2.verify(stored, password);
  } catch {
    // 存的值不是合法 argon2 串 -> 直接当失败
    return false;
  }
}
