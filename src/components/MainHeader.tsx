import { Layout, Menu, Input, Badge, Button, Space, Tag, Dropdown, Avatar, ConfigProvider } from "antd";
import { SearchOutlined, BellOutlined, PlusOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;

export default function MainHeader() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Хук для работы с URL
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || '1';          // 1 - все, 2 - мои

  // Обработка ввода в поиск
  const handleSearch = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set('search', value);
    else newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
    if (window.location.pathname !== '/') navigate(`/?${newParams.toString()}`);
  };

  // Переключение вкладок меню
  const handleTabChange = (key: string) => {
    if (key === '2' && !isAuthenticated) {
      navigate('/auth');
      return;
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', key);
    newParams.set('page', '1');
    setSearchParams(newParams);
    if (window.location.pathname !== '/') navigate(`/?${newParams.toString()}`);
  };

  // Меню для авторизованного пользователя
  const userMenuItems = [
    {
      key: 'profile_info',
      disabled: true,
      label: (
        <div style={{ padding: '4px 0', color: '#1c2434' }}>
          <div><strong>ID:</strong> {user?.sub}</div>
          {isAdmin && <Tag color="red" style={{ marginTop: '4px' }}>Администратор</Tag>}
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Выйти',
      onClick: () => logout(),
    },
  ];

  return (
    <Header style={{
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid #f0f0f0',
      height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px', color: '#000'}}>
          <SearchOutlined /> Бюро находок
        </div>

        <ConfigProvider theme={{ components: { Menu: { itemMarginInline: 0, itemBorderRadius: 0, itemPaddingInline: 20 } } }}>
          <Menu
            mode="horizontal"
            selectedKeys={[currentTab]}
            onClick={(e) => handleTabChange(e.key)}
            style={{ borderBottom: 'none', flex: 1, minWidth: 0, lineHeight: '62px' }}
            items={[
              { key: '1', label: 'Все объявления' },
              { key: '2', label: 'Мои объявления' },
            ]}
          />
        </ConfigProvider>

      </div>

      <Space size={16} align="center" style={{ flex: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
        <Input.Search
          placeholder="Быстрый поиск..."
          allowClear
          onSearch={handleSearch}
          defaultValue={searchParams.get('search') || ''}
          prefix={<SearchOutlined style={{ color: '#bfbfbf'}} />}
          suffix={<span style={{ color: '#bfbfbf', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}></span>}
          style={{ borderRadius: '8px', width: '260px' }}
        />

        <Badge style={{ display: 'flex' }}>
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '18px'}} />} />
        </Badge>

        {/* Кнопка создания объявления (только для авторизованных пользователей) */}
        {isAuthenticated && (
          <Link to="/create" style={{ display: 'flex', }}>
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Link>
        )}

        {/* Кнопка аккаунта ИЛИ Войти */}
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: '32px' }}>
              <Avatar style={{ backgroundColor: '#2b82fb' }} icon={<UserOutlined />} />
            </div>
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/auth')} style={{ backgroundColor: '#2b82fb', border: 'none' }}>
            Войти
          </Button>
        )}
      </Space>
    </Header>
  );
}
