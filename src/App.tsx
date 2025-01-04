import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Anuncios from './pages/Anuncios';
import Feed from './pages/Feed';
import { Messages } from './pages/Messages';
import ConversationList from './pages/ConversationList';
import Favoritos from './pages/Favoritos';
import InstallApp from './pages/InstallApp';
import CriarAnuncio from './pages/CriarAnuncio';
import EditarAnuncio from './pages/EditarAnuncio';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/anuncios" element={<Anuncios />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/mensagens/:id" element={<Messages />} />
            <Route path="/mensagens/lista" element={<ConversationList />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/instalar" element={<InstallApp />} />
            <Route path="/criar-anuncio" element={<CriarAnuncio />} />
            <Route path="/editar-anuncio/:id" element={<EditarAnuncio />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;