import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout, Spin } from 'antd';

import MainHeader from './components/MainHeader';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import ItemDetailsPage from './pages/ItemDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import { LookupProvider, useLookup } from './context/LookupContext';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './pages/AuthPage';

const { Content } = Layout;

function AppContent() {
  const { isLoading } = useLookup();

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" description="Загрузка системы..." /></div>;
  }

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8fbfd' }}>
      <MainHeader />
      <Content style={{ padding: 0 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<CreatePage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LookupProvider>
          <AppContent />
        </LookupProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
