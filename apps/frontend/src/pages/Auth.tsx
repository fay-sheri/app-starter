import { BasicLayout } from '../layouts/BasicLayout'
import { Nav } from '../features/Nav/index'
import { Form, Input, Button, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/http'

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

export function Auth(){
    const [form] = Form.useForm<LoginFormValues>()

  const onFinish = (values: LoginFormValues) => {
    const payload = {
    username: values.username,
    password: values.password,
    remember: values.remember ?? false, 
  }
    console.log('登录:', payload)
    // loginMutation.mutate(values)
  }

  const content = (
    <div className="flex flex-col flex-initial justify-center items-center">
      <div className="w-120 h-120 bg-amber-200 flex items-center justify-center">
        <div className="w-80 p-6 bg-white rounded shadow">
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

            {/* <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item> */}

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )

  return <BasicLayout header={<Nav />} content={content} />
}