import { useEffect, useState } from 'react';
import { Card, Tag, Checkbox, Space, Empty, Layout, Typography, Button, Row, Col, Select, Spin, Alert } from 'antd';
import { PlusOutlined, SearchOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons';
import type { Item } from '../types/item';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import { useLookup } from '../context/LookupContext';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const navigate = useNavigate();

  const { campuses, categories, campusesMap, categoriesMap } = useLookup();
  const [selectedCampuses, setSelectedCampuses] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    itemService.getAllItems(selectedCampuses, selectedCategories)
      .then(data => setItems(data))
      .catch(err => setError(err.message || 'Что-то пошло не так...'))
      .finally(() => setLoading(false));
  }, [selectedCampuses, selectedCategories]);

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Шапка главной страницы */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Бюро находок РТУ МИРЭА</Title>
          <Text type="secondary">Все потерянные и найденные вещи в одном месте</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate('/create')}
        >
          Опубликовать объявление
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* ЛЕВАЯ КОЛОНКА: Фильтры */}
        <Col xs={24} md={6}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '24px' }}>

            <Title level={4} style={{ marginTop: 0, marginBottom: '20px' }}>Фильтры</Title>

            {/* Блок фильтра по Кампусам */}
            <div style={{ marginBottom: '28px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}><EnvironmentOutlined /> Кампусы</Title>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={selectedCampuses}
                onChange={(checkedValues) => setSelectedCampuses(checkedValues as number[])}
              >
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {campuses.map(campus => (
                    <Checkbox key={campus.id} value={campus.id}>
                      {campus.address}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </div>

            {/* Блок фильтра по Категориям */}
            <div>
              <Title level={5} style={{ marginBottom: '16px' }}><AppstoreOutlined /> Категории</Title>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={selectedCategories}
                onChange={(checkedValues) => setSelectedCategories(checkedValues as number[])}
              >
                <Space orientation="vertical" style={{ width: '100%' }}>
                  {categories.map(cat => (
                    <Checkbox key={cat.id} value={cat.id}>
                      {cat.name}
                    </Checkbox>
                  ))}
                </Space>
              </Checkbox.Group>
            </div>

          </div>
        </Col>

        {/* ПРАВАЯ КОЛОНКА: Вывод карточек */}
        <Col xs={24} md={18}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}><Spin size="large" /></div>
          ) : items.length === 0 ? (
            <Empty description="Объявлений с такими фильтрами не найдено" style={{ padding: '60px 0' }} />
          ) : (
            <Row gutter={[16, 16]}>
              {items.map((item) => (
                <Col xs={24} sm={12} lg={8} key={item.id}>
                  <ItemCard item={item} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}
