import { api } from "../../lib/http";
import { encryptPassword } from "../../utils/rsa";
import { resetSessionGuard } from "./onSessionDead" //记得新会话恢复,不然401重新失败不会执行

const AuthPublicKeyPem = import.meta.env.VITE_AUTH_PUBLIC_KEY_PEM;

interface LoginData {
  token: string;
  userInfo: UserInfo;
}
interface UserInfo {
  id: number;
  username: string;
}
interface LoginResponse {
  code: number;
  data: LoginData;
  message: string;
}
export interface LoginFormValues {
  username: string;
  password: string;
}

export async function loginApi(data: LoginFormValues) {
  const playload = {
    ...data,
    password: await encryptPassword(data.password, AuthPublicKeyPem),
  };
  const res = await api.post<LoginResponse>("api/auth/login", playload);
  resetSessionGuard();
  return res.data;
}

interface RegisterData {
  userId: number;
  username: string;
}

interface RegisterResponse {
  code: number;
  data: RegisterData;
  message: string;
}
export interface RegisterFormValues {
  username: string;
  password: string;
}

export async function registerApi(data: RegisterFormValues) {
  const playload = {
    ...data,
    password: await encryptPassword(data.password, AuthPublicKeyPem),
  };
  const res = await api.post<RegisterResponse>("api/auth/register", playload);
  return res.data;
}

interface LogoutResponse{
  code: number;
  data: null;
  message: string;
}

export async function logoutApi() {
  const res = await api.post<LogoutResponse>("api/auth/logout")
  return res
}