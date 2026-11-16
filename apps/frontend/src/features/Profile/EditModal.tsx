import { Modal, Form, Input } from "antd";
// import { useEffect, useEffectEvent} from "react"

import type { UsersMeFormValues } from "../../api/profile";

interface EditModalProps {
  open: boolean;
  initial?: UsersMeFormValues;
  onClose: () => void;
  onSubmit: (values: UsersMeFormValues) => void | Promise<void>;
}
export function EditModal({
  open,
  initial,
  onClose,
  onSubmit,
}: EditModalProps) {
  const [form] = Form.useForm<UsersMeFormValues>(); //记得刷新数据，Form不是受控组件，如果使用initialValues属性只会在挂载后（第一次渲染）使用。渲染新数据需要手动调用更新数据,确保重新挂载也可以
  const applyInitial = () => {  //initial是同步渲染时候的值，如果要异步的值要做修改
    if (initial) {
      form.resetFields();
      form.setFieldsValue(initial);
    }
  };
  return (
    <Modal
      open={open}
      title="编辑资料"
      onCancel={onClose}
      onOk={() =>
        form
          .validateFields()
          .then((values: UsersMeFormValues) => onSubmit(values))
          .catch(() => {})
      }
      afterOpenChange={(o) => { if (o) applyInitial(); }}
      destroyOnHidden
    >
      {/** preserve字段被删除时是否保留值 */}
      {initial ? (
        <Form
          form={form}
          layout="vertical"
          preserve={false}
        >
          <Form.Item name="name" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="角色">
            <Input placeholder="" />
          </Form.Item>
          <Form.Item name="bio" label="简介">
            <Input.TextArea rows={3} maxLength={120} showCount />
          </Form.Item>
          <Form.Item name="location" label="所在地">
            <Input />
          </Form.Item>
        </Form>
      ) : (
        <p>数据加载</p>
      )}
    </Modal>
  );
}
