import { useEffect, useState } from 'react';
import { Form, Input, Select, Radio, Button, Upload, message, Typography, Spin, InputNumber } from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import FormItem from 'antd/es/form/FormItem';
import { itemService } from '../services/itemService';
import { useLookup } from '../context/LookupContext';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { Dragger } = Upload;

export default function CreatePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { campuses, categories } = useLookup();
  const { isAdmin } = useAuth();

  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingItem, setIsLoadingItem] = useState(!!id);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      itemService.getItemById(id)
        .then((data) => {
          // Заполнение формы старыми данными
          form.setFieldsValue({
            title: data.title,
            categoryId: data.categoryId,
            campusId: data.campusId,
            status: data.status,
            description: data.description,
            ownerId: data.ownerId,
          });
          if (data.imageUrl) {
            setFileList([{ uid: '-1', name: 'Текущее фото', status: 'done', url: data.imageUrl }]);
          }
        })
        .catch(() => {
          message.error('Не удалось загрузить данные объявления');
        })
        .finally(() => setIsLoadingItem(false));
    }
  }, [id, form, navigate, isEditMode]);

  const uploadProps = {
    beforeUpload: () => false,
    onChange: (info: any) => setFileList(info.fileList),
    fileList,
    maxCount: 1,
  };

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('categoryId', values.categoryId);
    formData.append('campusId', values.campusId);
    formData.append('status', values.status);
    formData.append('description', values.description || '');

    // Если пользователь - админ, и правит чужое объявление
    if (isAdmin && values.ownerId) {
      formData.append('ownerId', values.ownerId);
    }

    // Если загружен новый файл
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('image', fileList[0].originFileObj as Blob);
    }

    try {
      if (isEditMode) {
        await itemService.updateItem(Number(id), formData);
        message.success('Объявление успешно обновлено!');
        navigate(`/item/${id}`);
      } else {
        await itemService.createItem(formData);
        message.success('Объявление успешно создано!');
        navigate('/');
      }
    } catch (error) {
      message.error(`Ошибка при ${isEditMode ? 'обновлении' : 'создании'} объявления!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingItem) return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" tip="Загрузка данных..." /></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
      <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(isEditMode ? `/item/${id}` : '/')} style={{ marginBottom: '20px' }}>
        Назад
      </Button>

      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Title level={3} style={{ marginTop: 0, marginBottom: '24px'}}>
          {isEditMode ? 'Редактирование объявления' : 'Новое объявление'}
        </Title>

        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: 'found' }}>

          {/* СЕКРЕТНЫЙ БЛОК АДМИНИСТРАТОРА */}
          {isAdmin && isEditMode && (
            <div style={{ padding: '16px', backgroundColor: '#fff1f0', border: '1px solid #ffa39e', borderRadius: '8px', marginBottom: '24px' }}>
              <Title level={5} type="danger">Режим Администратора</Title>
              <Form.Item name="ownerId" label="ID Владельца (передача прав)">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </div>
          )}

          <Form.Item name="status" label="Тип объявления">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="found">Я нашёл вещь</Radio.Button>
              <Radio.Button value="lost">Я потерял вещь</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Например, синяя папка с чертежами" size="large" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="categoryId" label="Категория" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Выберите..." size="large">
                {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
              </Select>
            </Form.Item>

            <Form.Item name="campusId" label="Кампус" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Где это было?" size="large">
                {campuses.map(c => <Select.Option key={c.id} value={c.id}>{c.address}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="description" label="Подробное описание">
            <Input.TextArea rows={4} placeholder="Особые приметы..." />
          </Form.Item>

          <Form.Item label="Фотография">
            <Dragger {...uploadProps} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon"><InboxOutlined style={{ color: '#2b82fb', fontSize: '48px' }} /></p>
              <p className="ant-upload-text">{isEditMode ? 'Загрузите новое фото для замены' : 'Нажмите или перетащите файл сюда'}</p>
            </Dragger>
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting} style={{ backgroundColor: '#1c2434', width: '100%' }}>
              {isEditMode ? 'Сохранить изменения' : 'Опубликовать объявление'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
