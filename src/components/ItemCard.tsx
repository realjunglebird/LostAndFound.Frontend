import { Card, Tag, Space, Typography } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Item } from '../types/item';
import { useLookup } from '../context/LookupContext';
import { formatDate } from '../utils/dateUtils';

const { Text } = Typography;

interface Props {
  item: Item;
}

export default function ItemCard({ item }: Props) {
  const navigate = useNavigate();
  const { campusesMap, categoriesMap } = useLookup();

  return (
    <Card
      hoverable
      onClick={() => navigate(`/item/${item.id}`)}
      cover={
        item.imageUrl ? (
          <div style={{ height: '200px', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
            <img alt={item.title} src={item.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={{ height: '200px', backgroundColor: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px 12px 0 0' }}>
            <Text type="secondary">Нет фото</Text>
          </div>
        )
      }
      style={{ borderRadius: '12px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }} // Чтобы карточки были одинаковой высоты
    >
      {/* Статус Найдено/Потеряно */}
      <Tag color={item.status === 'found' ? 'green' : 'volcano'} style={{ marginBottom: '8px', alignSelf: 'flex-start' }}>
        {item.status === 'found' ? 'Найдено' : 'Потеряно'}
      </Tag>

      {/* Основная информация */}
      <Card.Meta
        title={item.title}
        description={
          <Space orientation="vertical" size={2} style={{ marginTop: '8px', width: '100%' }}>
            <Text type="secondary"><EnvironmentOutlined /> {campusesMap[item.campusId]}</Text>
            <Text type="secondary"><ClockCircleOutlined /> {formatDate(item.dateFound)}</Text>
            <Tag color="blue" style={{ marginTop: '4px' }}>{categoriesMap[item.categoryId]}</Tag>

            <p style={{ color: '#434343', marginTop: '8px', height: '44px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.description || 'Без описания'}
            </p>
          </Space>
        }
      />
    </Card>
  );
}
