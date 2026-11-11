import { Modal, Form, Input } from "antd";

export function EditModal({ open, initial, onClose, onSubmit }) {
  const [form] = Form.useForm();
  return (
    <Modal
      open={open}
      title="编辑资料"
      onCancel={onClose}
      onOk={() => form.validateFields().then(onSubmit)}
      destroyOnClose
    >
      <Form form={form} initialValues={initial} layout="vertical">
        <Form.Item name="name" label="昵称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="role" label="角色">
          <Input placeholder="前端开发者 · 广州" />
        </Form.Item>
        <Form.Item name="bio" label="简介">
          <Input.TextArea rows={3} maxLength={120} showCount />
        </Form.Item>
        <Form.Item name="location" label="所在地">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
