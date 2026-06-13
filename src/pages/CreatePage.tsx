import { useState } from 'react';
import { Form, Input, Select, Radio, Button, Upload, message, Typography } from 'antd';
import { InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import FormItem from 'antd/es/form/FormItem';
import { itemService } from '../services/itemService';
import { useLookup } from '../context/LookupContext';

const { Title } = Typography;
const { Dragger } = Upload;

export default function CreatePage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { campuses, categories } = useLookup();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadProps = {
    beforeUpload: () => false,
    onChange: (info: any) => {
      setFileList(info.fileList);
    },
    // onRemove: (file: any) => {
    //   setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    // },

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

    if (fileList.length > 0) {
      const actualFile = fileList[0].originFileObj || fileList[0];
      formData.append('image', actualFile as Blob);
    }

    try {
      await itemService.createItem(formData);
      message.success('Объявление успешно создано!');
      navigate('/');
    } catch (error) {
      message.error('Ошибка при создании объявления!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px' }}
      >
        Назад к ленте
      </Button>

      <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Title level={3} style={{ marginTop: 0, marginBottom: '24px'}}>Новое объявление</Title>

        <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={{ status: 'found' }}>
          <Form.Item name="status" label="Тип объявления">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="found">Я нашёл вещь</Radio.Button>
              <Radio.Button value="lost">Я потерял вещь</Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* Название */}
          <FormItem name="title" label="Название" rules={[{ required: true }]}>
            <Input placeholder="Например, синяя папка с чертежами" size="large" />
          </FormItem>

          {/* Категория */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item name="categoryId" label="Категория" rules={[{ required: true }]}>
              <Select placeholder="Выберите..." size="large">
                {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
              </Select>
            </Form.Item>

            {/* Кампус */}
            <Form.Item name="campusId" label="Кампус" rules={[{ required: true }]} style={{ flex: 1 }}>
              <Select placeholder="Где это было?" size="large">
                {campuses.map(c => <Select.Option key={c.id} value={c.id}>{c.address}</Select.Option>)}
              </Select>
            </Form.Item>
          </div>

          {/* Описание */}
          <Form.Item name="description" label="Подробное описание">
            <Input.TextArea rows={4} placeholder="Особые приметы..." />
          </Form.Item>

          {/* ЗОНА ПЕРЕТАСКИВАНИЯ КАРТИНКИ */}
          <Form.Item label="Фотография">
            <Dragger {...uploadProps} style={{ padding: '20px' }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: '#2b82fb', fontSize: '48px' }} />
              </p>
              <p className="ant-upload-text">Нажмите или перетащите файл сюда</p>
              <p className="ant-upload-hint">Поддерживаются форматы JPG, PNG (до 5 МБ)</p>
            </Dragger>
          </Form.Item>

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" size="large" loading={isSubmitting} style={{ backgroundColor: '#1c2434', width: '100%' }}>
              Опубликовать объявление
            </Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  );
}
