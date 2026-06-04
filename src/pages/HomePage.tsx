import { useEffect, useState } from 'react';
import { Layout, Typography, Button, Row, Col, Select, Spin, Alert } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { Announcement } from '../types/announcement';
import { itemService } from '../services/itemService';
import AnnouncementCard from '../components/AnnouncementCard';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function HomePage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    itemService.getAllItems()
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Что-то пошло не так...');
        setLoading(false);
      });
  }, []);



  return (
    <div>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Title level={2}>Потеряли или нашли вещь в университете?</Title>
            <Paragraph style={{ fontSize: '16px' }}>
              Мы поможем вернуть её владельцу. Быстрый поиск по корпусам и категориям.
            </Paragraph>
            <div style={{ marginTop: '20px' }}>
              <Button type='primary' size='large' icon={<PlusOutlined />} style={{ marginRight: '15px' }}>
                Я нашёл вещь
              </Button>
              <Button size='large' icon={<SearchOutlined />}>
                Я потерял вещь
              </Button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, marginBottom: '12px' }}>Все объявления</h1>
              <Select
                defaultValue="new"
                style={{ width: '150px'}}
                variant="borderless"
                options={[{ value: 'new', label: 'Сначала новые' }]}
                />
            </div>
          </div>


          {loading && (
            <div style={{ textAlign: 'center', padding: '50px '}}>
              <Spin size="large" tip="Загрузка объявлений..." />
            </div>
          )}

          {error && (
            <Alert message="Ошибка сервера" description={error} type="error" showIcon style={{ marginBottom: '20px' }} />
          )}

          {!loading && !error && announcements.length === 0 && (
            <div style={{ textAlign: 'center', padding: '50px', color: '#8c8c8c' }}>
              <h3>Пока нет ни одного объявления!</h3>
            </div>
          )}


          {!loading && !error && (
            <Row gutter={[20, 20]}>
              {announcements.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                  <AnnouncementCard item={item} />
                </Col>
              ))}
            </Row>
          )}

        </div>
        </div>

  );
}
