import { useEffect, useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Typography, Input, message, Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/userService";

const { Title } = Typography;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    userService.getUserById(id)
      .then((data) => {
        // Заполняем форму текущими данными
        form.setFieldsValue({
          name: data.name,
          lastName: data.lastName,
          middleName: data.middleName,
        });
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading(false));
  }, [id, form]);

  const handleFinish = async (values: any) => {
    setSaving(true);
    try {
      await userService.updateUser(Number(id), values);
      message.success('Данные успешно обновлены');
      navigate(`/profile/${id}`);
    } catch (err: any) {
      message.error(err.message || 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 24px' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        Назад к профилю
      </Button>

      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Title level={3} style={{ marginTop: 0, marginBottom: '24px' }}>Редактирование профиля</Title>

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="lastName" label="Фамилия" rules={[{ required: true, message: 'Введите фамилию' }]}>
            <Input placeholder="Иванов" size="large" />
          </Form.Item>

          <Form.Item name="name" label="Имя" rules={[{ required: true, message: 'Введите имя' }]}>
            <Input placeholder="Иван" size="large" />
          </Form.Item>

          <Form.Item name="middleName" label="Отчество (если есть)">
            <Input placeholder="Иванович" size="large" />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" loading={saving} style={{ width: '100%', backgroundColor: '#1c2434' }}>
              Сохранить изменения
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
