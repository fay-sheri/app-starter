import * as profilesRepository from "../repositories/user-profiles.js";
import type { ProfileWithSkills } from "../types/profile.js";
import type { updateProfileType } from "../schemas/profile.js";
import { AppError } from "../errors/index.js";

export async function getProfile(userId: string) {
  let profilData: ProfileWithSkills | null;
  profilData = await profilesRepository.findProfileByUserId(userId);
  if (!profilData) throw new AppError(500, 500, "用户的个人数据不存在");
  return { profilData };
}

export async function updataProfile(userId: string, newProfilData: updateProfileType) {
  if(newProfilData.skills) {
    await profilesRepository.ensureSkillsExist(newProfilData.skills);
    await profilesRepository.replaceUserSkills(userId, newProfilData.skills)
  }
  await profilesRepository.updateProfile(userId, newProfilData);
  return await getProfile(userId);
}