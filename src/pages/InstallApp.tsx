import { Apple, Chrome, Download, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";

const InstallApp = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Instale nosso App</h1>
        <p className="text-lg text-foreground/70">
          Acesse o ClassiAds diretamente do seu celular e receba notificações de novas mensagens
        </p>
      </div>

      <div className="space-y-8">
        {/* iOS Safari */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Apple className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold">iPhone e iPad (Safari)</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-foreground/80">
            <li>Abra o Safari e acesse nosso site</li>
            <li>Toque no ícone de compartilhar (□↑)</li>
            <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
            <li>Toque em "Adicionar" para confirmar</li>
          </ol>
        </div>

        {/* Android Chrome */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Chrome className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold">Android (Chrome)</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-foreground/80">
            <li>Abra o Chrome e acesse nosso site</li>
            <li>Toque no menu (⋮) no canto superior direito</li>
            <li>Selecione "Adicionar à tela inicial"</li>
            <li>Toque em "Adicionar" para confirmar</li>
          </ol>
        </div>

        {/* Desktop */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold">Computador (Chrome)</h2>
          </div>
          <ol className="list-decimal list-inside space-y-3 text-foreground/80">
            <li>Abra o Chrome e acesse nosso site</li>
            <li>Clique no ícone de instalação (🔽) na barra de endereço</li>
            <li>Clique em "Instalar" para confirmar</li>
          </ol>
        </div>

        {/* Benefits */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-8 h-8 text-primary" />
            <h2 className="text-xl font-semibold">Benefícios do App</h2>
          </div>
          <ul className="list-disc list-inside space-y-3 text-foreground/80">
            <li>Acesso rápido direto da tela inicial</li>
            <li>Receba notificações de novas mensagens</li>
            <li>Interface otimizada para celular</li>
            <li>Funciona offline</li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;