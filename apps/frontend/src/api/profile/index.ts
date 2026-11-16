import { api } from "../../lib/http";

interface UserProfile {
  id: number;
  username: string;
  name: string;
//   handle: string;
  role?: string;
  bio?: string;
  location?: string;
  avatar?: string;
//   link
  skills: string[];
//   stats: { works: number; likes: number; following: number };
}

interface UsersMeResponse {
  code: number;
  data: UserProfile;
  message: string;
}

type PatchProfilePayload = Partial<Pick<UserProfile, "name" | "role" | "bio" | "location">>;
export type UsersMeFormValues = PatchProfilePayload


export async function getUsersMeApi() {
    const res = await api.get<UsersMeResponse>("api/users/me");
    return res.data.data
}

export async function patchUsersMeApi(data: PatchProfilePayload) {
    const res = await api.patch<UsersMeResponse>("api/users/me", data);
    return res.data.data
}