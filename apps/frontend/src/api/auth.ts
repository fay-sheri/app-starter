import { api } from '../lib/http'

interface LoginResponse {
    token: string
    user: string
}
export interface LoginFormValues {
    username: string;
    password: string;
}

export async function loginApi(data: LoginFormValues) {
    const res = await api.post<LoginResponse>("api/login", data)
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
    const res = await api.post<RegisterResponse>("api/register", data)
    return res.data
}