import { Layout, Typography, Button, Row, Col, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

import MainHeader from './components/MainHeader';
import AnnouncementCard from './components/AnnouncementCard';
import type { Announcement } from './types/announcement';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// Мок-данные (пока не подключен бэкенд)
const mockAnnouncements: Announcement[] = [
  { id: 1, title: "Наушники с переходником", location: "пр-кт. Вернадского, 78", status: "found", dateText: "неделю назад", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" },
  { id: 2, title: "Airpods", location: "ул. Малая Пироговская, 1, стр. 5", status: "found", dateText: "более недели назад", imageUrl: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500&q=80" },
  { id: 3, title: "Белая зарядка от ноутбука HUAWEI MateBook", location: "пр-кт. Вернадского, 78", status: "lost", dateText: "более недели назад" },
  { id: 4, title: "Зарядка от ноутбука Honor белого цвета (разъём type c)", location: "пр-кт. Вернадского, 78", status: "lost", dateText: "более недели назад" }
];

function App() {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fdfd' }}>
      <MainHeader />

      <Content style={{ padding: '0', backgroundColor: '#f5f5f5' }}>
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

          {/* Сетка карточек */}
          <Row gutter={[20, 20]}>
            {mockAnnouncements.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                <AnnouncementCard item={item} />
              </Col>
            ))}
          </Row>
        </div>

      </Content>
    </Layout>
  );
}

export default App;
