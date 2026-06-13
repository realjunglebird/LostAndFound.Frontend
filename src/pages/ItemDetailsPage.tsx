import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Alert, Tag, Space, Typography, Button, Divider } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { Item } from "../types/item";
import { itemService } from "../services/itemService";
import { formatDate } from "../utils/dateUtils";
import { useLookup } from "../context/LookupContext";

const { Title } = Typography;

export default function ItemDetailsPage() {
  const navigate = useNavigate();
  const { campusesMap, categoriesMap } = useLookup();
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID объявления не найден в URL");
      setLoading(false);
      return;
    }

    itemService.getItemById(id)
      .then((data) => setItem(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  if (error || !item) return <div style={{ padding: '50px' }}><Alert title="Ошибка" description={error} type="error" /></div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>

      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px' }}
      >
        Назад к ленте
      </Button>

      <Title level={3} style={{ marginTop: 0, marginBottom: '24px'}}>Детали объявления</Title>

      {/* Левая колонка - Картинка */}
      <div style={{ display: 'flex', gap: '32px', backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: '0 0 400px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e8edf3', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          {item.imageUrl? (
            <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: '#8c8c8c' }}>Нет фото</span>
          )}
        </div>

        {/* Правая колонка - Информация */}
        <div style={{ flex: 1 }}>
          <Space size={8} style={{ marginBottom: '16px' }}>
            {item.status === 'found' ? (
              <Tag color="success">Найдено</Tag>
            ) : (
              <Tag color="error">Потеряно</Tag>
            )}
            <Tag color="blue">{categoriesMap[item.categoryId]}</Tag>
          </Space>

          <div style={{ marginBottom: '24px', color: '#595959' }}>
            <p><EnvironmentOutlined style={{ marginRight: '8px' }} /> <strong>Где:</strong> {campusesMap[item.campusId]}</p>
            <p><ClockCircleOutlined style={{ marginRight: '8px' }} /> <strong>Когда:</strong> {formatDate(item.dateFound)}</p>
          </div>

          <Divider />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Space>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserOutlined style={{ color: '#bfbfbf', fontSize: '20px' }} />
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>Студент РТУ МИРЭА</div>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Владелец объявления</div>
              </div>
            </Space>
            <Button type="primary" size="large">Связаться</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
