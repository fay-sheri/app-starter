import { BasicLayout } from '../layouts/BasicLayout'
import { Nav } from '../features/Nav/index'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { useMutation, } from '@tanstack/react-query'
import { queryClient } from '../lib/query-client'

import type { LoginFormValues } from '../api/auth'
import { loginApi } from '../api/auth'

import { useAuthStore } from '../store/authStore'

export function Auth() {
  const [form] = Form.useForm<LoginFormValues>()
  const login = useAuthStore(s => s.login)
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.token)
      queryClient.setQueryData(['user'], data.user)
    },
    onError: (err) => {
      console.error(err)
    },
  })
  const onFinish = (values: LoginFormValues) => {
    const payload = {
      username: values.username,
      password: values.password,
    }
    loginMutation.mutate(payload)
  }

  const content = (
    <div className="flex flex-col flex-auto justify-center items-center bg-blue-400 h-full">
      <div className="w-120 h-120 flex items-center justify-center
       bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl">
        <div className="w-80 p-6 bg-white rounded-3xl shadow">
          <h2 className="text-center mb-4">系统登录</h2>

          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="用户名" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="密码" />
            </Form.Item>


            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
          <p>想要注册？</p>
        </div>
      </div>
    </div>
  )

  return <BasicLayout header={<Nav />} content={content} />
}