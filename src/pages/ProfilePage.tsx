import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/userService";
import type { User } from "../types/user";
import { Button, message, Space, Spin, Tag, Typography, Avatar, Divider } from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined, EditOutlined, UserOutlined, StopOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      message.error('ID пользователя не указан!');
      setLoading(false);
      return;
    }

    userService.getUserById(id)
      .then((data) => setCurrentUser(data))
      .catch((err: any) => message.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = isAuthenticated && currentUser?.id?.toString() === user?.sub;
  const canManage = isOwner || isAdmin;

  const handleToggleBan = async () => {
    try {
      const res = await userService.toggleBan(Number(id));
      setCurrentUser(prev => prev ? {...prev, isBanned: res.isBanned } : null);
      message.success(res.message);
    } catch (err: any) {
      message.error(err.message);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (!currentUser) return <div style={{ textAlign: 'center', padding: '50px' }}><Title level={4}>Пользователь не найден</Title></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)} // Возвращаемся на предыдущую страницу логически
        style={{ marginBottom: '20px' }}
      >
        Назад
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={3} style={{ margin: 0 }}>Профиль пользователя</Title>

        {canManage && (
          <Space>
            {isAdmin && !isOwner && (
              <Button
                type={currentUser.isBanned ? "default" : "primary"}
                danger={!currentUser.isBanned}
                icon={currentUser.isBanned ? <CheckCircleOutlined /> : <StopOutlined />}
                onClick={handleToggleBan}
                style={currentUser.isBanned ? { borderColor: '#52c41a', color: '#52c41a' } : {}}
              >
                {currentUser.isBanned ? 'Разблокировать' : 'Заблокировать'}
              </Button>
            )}
            {isOwner && (
              <Button icon={<EditOutlined />} onClick={() => navigate(`/profile/edit/${currentUser.id}`)}>
                Редактировать
              </Button>
            )}
          </Space>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
      }}>
        {/* Левая колонка с информацией */}
        <div style={{ flex: 1, paddingRight: '24px' }}>
          <Space size={8} style={{ marginBottom: '16px' }}>
            {isOwner && <Tag color="blue">Ваш профиль</Tag>}
            {currentUser.role === 'Admin' && <Tag color="purple">Администратор</Tag>}
            {currentUser.isBanned && <Tag color="error">Аккаунт заблокирован</Tag>}
          </Space>

          <Title level={2} style={{ marginTop: 0, marginBottom: '24px' }}>
            {currentUser.lastName} {currentUser.name} {currentUser.middleName}
          </Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '16px' }}>
            <div>
              <Text type="secondary" style={{ display: 'block', fontSize: '14px' }}>Адрес электронной почты</Text>
              <Text strong>{currentUser.email}</Text>
            </div>
            <Divider style={{ margin: '12px 0' }} />
            <div>
              <Text type="secondary" style={{ display: 'block', fontSize: '14px' }}>Идентификатор (ID)</Text>
              <Text strong>#{currentUser.id}</Text>
            </div>
          </div>
        </div>

        {/* Правая колонка с аватаркой */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '24px', borderLeft: '1px solid #f0f0f0' }}>
          <Avatar
            size={160}
            icon={<UserOutlined />}
            style={{ backgroundColor: '#e8edf3', color: '#b0c4de' }}
          />
        </div>
      </div>
    </div>
  );
}
