import { Layout, Menu, Input, Badge, Button, Space } from "antd";
import { SearchOutlined, BellOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function MainHeader() {
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
      <Space size={32}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '16px', color: '#000'}}>
          <span style={{ fontSize: '20px' }}>🔱</span> Бюро находок
        </div>

        <Menu
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ borderBottom: 'none', minWidth: '200px' }}
          items={[
            { key: '1', label: 'Находки' },
            { key: '2', label: 'Пропажи' },
          ]}
        />
      </Space>

      <Space size={16} style={{ flex: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
        <Input
          placeholder="Быстрый поиск"
          prefix={<SearchOutlined style={{ color: '#bfbfbf'}} />}
          suffix={<span style={{ color: '#bfbfbf', backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}></span>}
          style={{ borderRadius: '8px', width: '260px' }}
        />
        <Badge dot>
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '18px'}} />} />
        </Badge>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} />
        <Button type="primary" shape="circle" icon={<UserOutlined />} />
      </Space>
    </Header>
  );
}
