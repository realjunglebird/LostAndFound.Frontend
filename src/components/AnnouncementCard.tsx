import { Card, Tag, Space } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, PictureOutlined } from '@ant-design/icons';
import type { Announcement } from '../types/announcement';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: Announcement;
}

export default function AnnouncementCard({ item }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/item/${item.id}`)}
      style={{ borderRadius: '16px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}
      cover={
        item.imageUrl ? (
          <div style={{ height: '200px', overflow: 'hidden' }}>
            <img alt={item.title} src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ height: '200px', backgroundColor: '#e8edf3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PictureOutlined style={{ fontSize: '40px', color: '#b0c4de' }} />
          </div>
        )
      }
    >
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 8px 0', minHeight: '40px', lineHeight: '1.4'}}>
          {item.title}
        </h3>
        <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: '12px' }}>
          <EnvironmentOutlined style={{ marginRight: '4px' }} /> {item.location}
        </div>
      </div>

      <Space size={4} style={{ marginTop: 'auto' }}>
        {item.status === 'found' ? (
          <Tag color="success" style={{ borderRadius: '6px', border: 'none', backgroundColor: '#e6f7ff', color: '#1677ff' }}>Найдено</Tag>
        ) : (
          <Tag color="error" style={{ borderRadius: '6px', border: 'none', backgroundColor: '#fff1f0', color: '#ff4d4f' }}>Потеряно</Tag>
        )}
        <span style={{ color: '#bfbfbf', fontSize: '12px' }}>
          <ClockCircleOutlined style={{ marginRight: '4px' }} /> {item.dateFound}
        </span>
      </Space>
    </Card>
  );
}
