import { AdvertisementForm } from "@/components/advertisement/AdvertisementForm";

const CriarAnuncio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
        {/* Header with gradient text */}
        <div className="space-y-2 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Criar Anúncio
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Preencha as informações abaixo para criar seu anúncio
          </p>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
          
          {/* Form container with glass effect */}
          <div className="relative backdrop-blur-sm">
            <AdvertisementForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarAnuncio;