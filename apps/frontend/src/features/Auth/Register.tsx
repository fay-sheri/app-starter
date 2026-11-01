import { Form, Input, Button, Typography, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
const { Link } = Typography

import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/query-client";

import type { LoginFormValues } from "../../api/auth";
import { registerApi, loginApi } from "../../api/auth";

import { useAuthStore } from "../../store/authStore";

import { useNavigate } from 'react-router-dom';

import type { Dispatch, SetStateAction } from 'react'
interface props {
    setRegisterMode: Dispatch<SetStateAction<boolean>>
}

export function Register({setRegisterMode}: props) {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();
  const login = useAuthStore((s) => s.login);
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.token);
      queryClient.setQueryData(["user"], data.user);
      navigate('/');
    },
    onError: (err) => {
      console.error(err);
      message.error("登录失败");
    },
  });
  const registerMutation = useMutation({
    mutationFn: registerApi,
  });
  const onFinish = async (values: LoginFormValues) => {
    const payload = {
      username: values.username,
      password: values.password,
    };
    try {
      await registerMutation.mutateAsync(payload);
      loginMutation.mutate(payload); //注册后自动登录
    } catch (err) {
      console.error(err);
      message.error("注册失败");
    }
  };
  return (
    <div
      className="w-120 h-120 flex items-center justify-center
       bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl"
    >
      <div className="w-80 p-6 bg-white rounded-3xl shadow">
        <h2 className="text-center mb-4">注册</h2>

        <Form
          form={form}
          layout="vertical"
          initialValues={{}}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loginMutation.isPending} disabled={loginMutation.isPending}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <Link className="block text-center mt-2"
          onClick={() => setRegisterMode(false)}>想要登录？</Link>
      </div>
    </div>
  );
}
