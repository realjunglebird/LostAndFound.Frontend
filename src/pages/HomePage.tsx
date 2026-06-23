import { useEffect, useState } from 'react';
import { Card, Tag, Checkbox, Space, Empty, Layout, Typography, Button, Row, Col, Spin, Pagination, Radio, DatePicker } from 'antd';
import { PlusOutlined, EnvironmentOutlined, AppstoreOutlined, AlertOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Item } from '../types/item';
import { itemService } from '../services/itemService';
import ItemCard from '../components/ItemCard';
import { useLookup } from '../context/LookupContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs'; // Импортируем dayjs для работы с DatePicker

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { campuses, categories } = useLookup();
  const { user, isAuthenticated } = useAuth();

  // Стейты данных
  const [items, setItems] = useState<Item[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. ПОЛУЧЕНИЕ ПАРАМЕТРОВ НАПРЯМУЮ ИЗ URL (Single Source of Truth)
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentTab = searchParams.get('tab') || '1';
  const searchQuery = searchParams.get('search') || undefined;

  const selectedCampuses = searchParams.getAll('campus').map(Number);
  const selectedCategories = searchParams.getAll('category').map(Number);
  const selectedStatus = searchParams.get('status') || '';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // 2. УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ URL
  const updateFilterParams = (key: string, values: string | string[] | null) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key); // Очищаем старые значения ключа

    if (Array.isArray(values)) {
      values.forEach(v => newParams.append(key, v)); // Для чекбоксов (множественные значения)
    } else if (values) {
      newParams.set(key, values); // Для радиокнопок и одиночных строк
    }

    newParams.set('page', '1'); // При любом изменении фильтра сбрасываем на первую страницу
    setSearchParams(newParams);
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    const newParams = new URLSearchParams(searchParams);
    if (dates) {
      newParams.set('startDate', dateStrings[0]);
      newParams.set('endDate', dateStrings[1]);
    } else {
      newParams.delete('startDate');
      newParams.delete('endDate');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  useEffect(() => {
    setLoading(true);
    const ownerId = currentTab === '2' && user ? Number(user.sub) : undefined;

    itemService.getAllItems({
      campusIds: selectedCampuses,
      categoryIds: selectedCategories,
      status: selectedStatus || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      search: searchQuery,
      ownerId: ownerId,
      page: currentPage,
      pageSize: 12,
    })
      .then(res => {
        setItems(res.items);
        setTotalItems(res.totalCount);
      })
      .catch(err => setError(err.message || 'Что-то пошло не так...'))
      .finally(() => setLoading(false));
  }, [
    searchParams, // Запрос на бэкенд улетает при любом изменении параметров в URL
    user,
  ]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Шапка главной страницы */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {currentTab === '2' ? 'Мои объявления' : (searchQuery ? `Поиск: "${searchQuery}"` : 'Бюро находок РТУ МИРЭА')}
          </Title>
          <Text type="secondary">Все потерянные и найденные вещи в одном месте</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate(isAuthenticated ? '/create' : '/auth')}
        >
          Опубликовать объявление
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* ЛЕВАЯ КОЛОНКА: Фильтры */}
        <Col xs={24} md={6}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '24px' }}>

            <Title level={4} style={{ marginTop: 0, marginBottom: '20px' }}>Фильтры</Title>

            {/* Блок фильтра по Статусу */}
            <div style={{ marginBottom: '28px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}><AlertOutlined /> Статус</Title>
              <Radio.Group
                style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}
                value={selectedStatus}
                onChange={e => updateFilterParams('status', e.target.value)}
              >
                <Radio value="">Все</Radio>
                <Radio value="lost">Потеряно</Radio>
                <Radio value="found">Найдено</Radio>
              </Radio.Group>
            </div>

            {/* Блок фильтра по Дате публикации */}
            <div style={{ marginBottom: '28px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}><CalendarOutlined /> Дата публикации</Title>
              <RangePicker
                style={{ width: '100%' }}
                value={startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : null}
                onChange={handleDateChange}
              />
            </div>

            {/* Блок фильтра по Кампусам */}
            <div style={{ marginBottom: '28px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}><EnvironmentOutlined /> Кампусы</Title>
              <Checkbox.Group
                style={{ width: '100%' }}
                value={selectedCampuses}
                onChange={(values) => updateFilterParams('campus', values.map(String))}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
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
                onChange={(values) => updateFilterParams('category', values.map(String))}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
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
        <Col xs={24} md={18} style={{ display: 'flex', flexDirection: 'column', }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', flex: 1, }}><Spin size="large" /></div>
          ) : items.length === 0 ? (
            <Empty description="Объявлений с такими фильтрами не найдено" style={{ padding: '60px 0', flex: 1, }} />
          ) : (
            <>
              <Row gutter={[16, 16]} style={{ flex: 1, alignContent: 'flex-start' }}>
                {items.map((item) => (
                  <Col xs={24} sm={12} lg={8} key={item.id}>
                    <ItemCard item={item} />
                  </Col>
                ))}
              </Row>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', paddingBottom: '20px', }}>
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={12}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}
