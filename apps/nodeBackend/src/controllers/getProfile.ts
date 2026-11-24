import type { Context, Next } from "koa";
import { AppError } from "../errors/index.js";
import * as profileService from "../services/profileService.js";

export async function getProfile(ctx: Context, next: Next) {
  if (!ctx.state.verifyUser)
    throw new AppError(500, 500, "没有经过验证的AccessToken数据");
  const { profilData } = await profileService.getProfile(
    ctx.state.verifyUser.id,
  );
  ctx.body = {
    code: 200,
    message: "信息提供成功",
    data: {
      username: profilData.name,
      name: profilData.name,
      role: profilData.role ?? undefined,
      bio: profilData.bio ?? undefined,
      avatar: profilData.avatar ?? undefined,
      location: profilData.location ?? undefined,
      skills: profilData.skills,
    },
  };
}
