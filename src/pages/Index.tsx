import { Link } from 'react-router-dom';
import { Search, Shield, Heart, MessageSquare, Camera, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="min-h-screen space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            Encontre os Melhores Acompanhantes
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            A plataforma mais segura e discreta para encontrar acompanhantes de luxo. 
            Anúncios verificados e experiências únicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/anuncios">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="mr-2 h-5 w-5" />
                Explorar Anúncios
              </Button>
            </Link>
            <Link to="/criar-anuncio">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Camera className="mr-2 h-5 w-5" />
                Criar Anúncio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Por que escolher o Lov Class?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <Shield className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Segurança Garantida</h3>
                <p className="text-muted-foreground">
                  Todos os anúncios são verificados pela nossa equipe para garantir sua segurança
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <Star className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-semibold text-foreground">Anúncios Premium</h3>
                <p className="text-muted-foreground">
                  Acompanhantes de alto nível com fotos reais e informações verificadas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <MessageSquare className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Chat Privativo</h3>
                <p className="text-muted-foreground">
                  Converse de forma segura e discreta com os acompanhantes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <Heart className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-semibold text-foreground">Lista de Favoritos</h3>
                <p className="text-muted-foreground">
                  Salve seus anúncios favoritos para acessar rapidamente
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <Clock className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-xl font-semibold text-foreground">Disponibilidade</h3>
                <p className="text-muted-foreground">
                  Anúncios atualizados em tempo real com horários disponíveis
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background/60 backdrop-blur-sm border border-border/50 hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6 text-center space-y-4">
                <MapPin className="w-12 h-12 mx-auto text-accent" />
                <h3 className="text-xl font-semibold text-foreground">Localização</h3>
                <p className="text-muted-foreground">
                  Encontre acompanhantes próximos a você em diversas cidades
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 backdrop-blur-sm border border-border/50 rounded-lg p-8 md:p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Comece a Anunciar Hoje Mesmo
          </h2>
          <p className="text-xl text-muted-foreground">
            Junte-se a milhares de acompanhantes que já fazem sucesso em nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registro">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
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