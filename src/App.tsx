import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';

import MainHeader from './components/MainHeader';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import ItemDetailsPage from './pages/ItemDetailsPage';

const { Content } = Layout;

export default function App() {
  return (
    <BrowserRouter>

      <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fdfd' }}>
        <MainHeader />

        <Content style={{ padding: '0'}}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/item/:id" element={<ItemDetailsPage />} />
          </Routes>
        </Content>
      </Layout>

    </BrowserRouter>
  );
}
