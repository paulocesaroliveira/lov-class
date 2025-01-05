import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Index } from "@/pages/Index";
import { Login } from "@/pages/Login";
import { Registro } from "@/pages/Registro";
import { Anuncios } from "@/pages/Anuncios";
import { CriarAnuncio } from "@/pages/CriarAnuncio";
import { EditarAnuncio } from "@/pages/EditarAnuncio";
import { Feed } from "@/pages/Feed";
import { Favoritos } from "@/pages/Favoritos";
import { Perfil } from "@/pages/Perfil";
import { Admin } from "@/pages/Admin";
import { AdminLogin } from "@/pages/AdminLogin";
import { InstallApp } from "@/pages/InstallApp";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/anuncios" element={<Anuncios />} />
            <Route path="/anuncios/criar" element={<CriarAnuncio />} />
            <Route path="/anuncios/:id/editar" element={<EditarAnuncio />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/favoritos" element={<Favoritos />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/install" element={<InstallApp />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;