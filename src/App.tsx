import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Anuncios from "./pages/Anuncios";
import Feed from "./pages/Feed";
import Favoritos from "./pages/Favoritos";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import InstallApp from "./pages/InstallApp";
import CriarAnuncio from "./pages/CriarAnuncio";
import EditarAnuncio from "./pages/EditarAnuncio";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/anuncios" element={<Anuncios />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/install-app" element={<InstallApp />} />
            <Route path="/criar-anuncio" element={<CriarAnuncio />} />
            <Route path="/editar-anuncio/:id" element={<EditarAnuncio />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" expand={true} richColors />
      </AuthProvider>
    </Router>
  );
}

export default App;