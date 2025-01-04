import { Link } from 'react-router-dom';
import { Search, Shield, Heart, MessageSquare, Camera, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Encontre os Melhores Acompanhantes
          </h1>
          <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
            A plataforma mais segura e discreta para encontrar acompanhantes de luxo. 
            Anúncios verificados e experiências únicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/anuncios">
              <Button size="lg" className="w-full sm:w-auto">
                <Search className="mr-2" />
                Explorar Anúncios
              </Button>
            </Link>
            <Link to="/criar-anuncio">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Camera className="mr-2" />
                Criar Anúncio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Por que escolher o Lov Class?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <Shield className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Segurança Garantida</h3>
                <p className="text-foreground/70">
                  Todos os anúncios são verificados pela nossa equipe para garantir sua segurança
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <Star className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-semibold">Anúncios Premium</h3>
                <p className="text-foreground/70">
                  Acompanhantes de alto nível com fotos reais e informações verificadas
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-semibold">Chat Privativo</h3>
                <p className="text-foreground/70">
                  Converse de forma segura e discreta com os acompanhantes
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <Heart className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold">Lista de Favoritos</h3>
                <p className="text-foreground/70">
                  Salve seus anúncios favoritos para acessar rapidamente
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <Clock className="w-12 h-12 mx-auto text-secondary" />
                <h3 className="text-xl font-semibold">Disponibilidade</h3>
                <p className="text-foreground/70">
                  Anúncios atualizados em tempo real com horários disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6 text-center space-y-4">
                <MapPin className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-semibold">Localização</h3>
                <p className="text-foreground/70">
                  Encontre acompanhantes próximos a você em diversas cidades
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto glass-card p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Comece a Anunciar Hoje Mesmo
          </h2>
          <p className="text-xl text-foreground/80">
            Junte-se a milhares de acompanhantes que já fazem sucesso em nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registro">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Criar Conta Grátis
              </Button>
            </Link>
            <Link to="/anuncios">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Anúncios
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;