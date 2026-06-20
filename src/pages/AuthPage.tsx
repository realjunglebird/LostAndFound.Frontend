import { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const { Title } = Typography;

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const data = await authService.login(values.email, values.password);
      login(data.token); // Сохраняем токен в контекст и localStorage
      message.success('Вы успешно вошли в систему');
      navigate('/'); // Отправляем на главную
    } catch (error: any) {
      message.error(error.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      return message.error('Пароли не совпадают!');
    }
    setLoading(true);
    try {
      await authService.register(
        values.email,
        values.password,
        values.name,
        values.lastName,
        values.middleName,
      );
      message.success('Регистрация успешна! Теперь вы можете войти.');
      setActiveTab('login'); // Переключаем на вкладку входа
    } catch (error: any) {
      message.error(error.message || 'Ошибка при регистрации.');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'login',
      label: 'Вход',
      children: (
        <Form layout="vertical" onFinish={handleLogin} size="large">
          <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email (например, ivanov@mirea.ru)" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#1c2434' }}>
            Войти
          </Button>
        </Form>
      ),
    },
    {
      key: 'register',
      label: 'Регистрация',
      children: (
        <Form layout="vertical" onFinish={handleRegister} size="large">
          <Form.Item name="name" rules={[{ required: true, message: 'Введите ваше имя' }, { type: 'string', message: 'Введите ваше имя' }]}>
            <Input prefix={<UserOutlined />} placeholder="Иван" />
          </Form.Item>
          <Form.Item name="lastName" rules={[{ required: true, message: 'Введите вашу фамилию' }, { type: 'string', message: 'Введите вашу фамилию' }]}>
            <Input prefix={<UserOutlined />} placeholder="Иванов" />
          </Form.Item>
          <Form.Item name="middleName" rules={[{ required: false, message: 'Введите ваше отчество' }, { type: 'string', message: 'Введите ваше отчество' }]}>
            <Input prefix={<UserOutlined />} placeholder="Иванович" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: 'Введите почту' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Придумайте пароль' }, { min: 6, message: 'Минимум 6 символов' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: 'Повторите пароль' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Повторите пароль" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block style={{ backgroundColor: '#1c2434' }}>
            Зарегистрироваться
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f8fbfd' }}>
      <Card style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3} style={{ margin: 0 }}>Бюро находок</Title>
          <Typography.Text type="secondary">Войдите в свой аккаунт</Typography.Text>
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} centered />
      </Card>
    </div>
  );
}
