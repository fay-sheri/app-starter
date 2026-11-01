import { api } from '../lib/http'
import { encryptPassword } from "../utils/rsa"

const AuthPublicKeyPem = import.meta.env.VITE_AUTH_PUBLIC_KEY_PEM;

interface LoginResponse {
    token: string
    user: string
}
export interface LoginFormValues {
    username: string;
    password: string;
}

export async function loginApi(data: LoginFormValues) {
    const playload = {
        ...data,
        password: await encryptPassword(data.password,AuthPublicKeyPem)
    }
    const res = await api.post<LoginResponse>("api/login", playload)
    return res.data
}

interface RegisterResponse {
    user: string
}
export interface RegisterFormValues {
    username: string;
    password: string;
}

export async function registerApi(data: RegisterFormValues) {
    const playload = {
        ...data,
        password: await encryptPassword(data.password,AuthPublicKeyPem)
    }
    const res = await api.post<RegisterResponse>("api/register", playload)
    return res.data
}