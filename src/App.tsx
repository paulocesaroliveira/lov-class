import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import CriarAnuncio from "./pages/CriarAnuncio";
import EditarAnuncio from "./pages/EditarAnuncio";
import Perfil from "./pages/Perfil";
import Feed from "./pages/Feed";
import Anuncios from "./pages/Anuncios";
import Favoritos from "./pages/Favoritos";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import { Messages } from "./pages/Messages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="criar-anuncio" element={<CriarAnuncio />} />
            <Route path="editar-anuncio/:id" element={<EditarAnuncio />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="feed" element={<Feed />} />
            <Route path="anuncios" element={<Anuncios />} />
            <Route path="favoritos" element={<Favoritos />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="admin" element={<Admin />} />
            <Route path="mensagens/:conversationId" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;