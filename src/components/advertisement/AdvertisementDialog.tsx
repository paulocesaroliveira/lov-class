import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { services } from "./constants";
import { serviceLocations } from "./serviceLocations";

type AdvertisementDialogProps = {
  advertisement: any;
  onOpenChange: (open: boolean) => void;
};

export const AdvertisementDialog = ({ advertisement, onOpenChange }: AdvertisementDialogProps) => {
  if (!advertisement) return null;

  const getServiceLabel = (serviceId: string) => {
    return services.find((s) => s.id === serviceId)?.label || serviceId;
  };

  const getLocationLabel = (locationId: string) => {
    return serviceLocations.find((l) => l.id === locationId)?.label || locationId;
  };

  const calculateAge = (birthDate: string) => {
    return new Date().getFullYear() - new Date(birthDate).getFullYear();
  };

  return (
    <Dialog open={!!advertisement} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{advertisement.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna da Esquerda - Foto Principal */}
          <div className="space-y-6">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
              {advertisement.profile_photo_url ? (
                <img
                  src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${advertisement.profile_photo_url}`}
                  alt={advertisement.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground">Sem foto</span>
                </div>
              )}
            </div>

            {/* Galeria de Fotos */}
            {advertisement.advertisement_photos?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Galeria de Fotos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {advertisement.advertisement_photos.map((photo: any) => (
                    <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_photos/${photo.photo_url}`}
                        alt="Foto do anúncio"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna da Direita - Informações */}
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div>
              <h3 className="font-semibold mb-2">Informações Básicas</h3>
              <div className="space-y-2 text-sm">
                <p>Idade: {calculateAge(advertisement.birth_date)} anos</p>
                <p>Altura: {advertisement.height}cm</p>
                <p>Peso: {advertisement.weight}kg</p>
                <p>Categoria: {advertisement.category}</p>
                <p>Etnia: {advertisement.ethnicity}</p>
                <p>Cor do Cabelo: {advertisement.hair_color}</p>
                <p>Tipo Corporal: {advertisement.body_type}</p>
                <p>Silicone: {advertisement.silicone}</p>
                <p>Estilo: {advertisement.style}</p>
              </div>
            </div>

            {/* Localização e Contato */}
            <div>
              <h3 className="font-semibold mb-2">Localização e Contato</h3>
              <div className="space-y-2 text-sm">
                <p>Estado: {advertisement.state}</p>
                <p>Cidade: {advertisement.city}</p>
                <p>Bairro: {advertisement.neighborhood}</p>
                <p>WhatsApp: {advertisement.whatsapp}</p>
              </div>
            </div>

            {/* Valores */}
            <div>
              <h3 className="font-semibold mb-2">Valores</h3>
              <div className="space-y-2">
                <p className="text-lg font-medium">R$ {advertisement.hourly_rate}/hora</p>
                {advertisement.custom_rate_description && (
                  <div className="space-y-2">
                    {JSON.parse(advertisement.custom_rate_description).map((rate: any, index: number) => (
                      <p key={index}>
                        {rate.description}: R$ {rate.value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Serviços */}
            <div>
              <h3 className="font-semibold mb-2">Serviços</h3>
              <div className="flex flex-wrap gap-2">
                {advertisement.advertisement_services.map((service: any) => (
                  <Badge key={service.service} variant="secondary">
                    {getServiceLabel(service.service)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Locais de Atendimento */}
            <div>
              <h3 className="font-semibold mb-2">Locais de Atendimento</h3>
              <div className="flex flex-wrap gap-2">
                {advertisement.advertisement_service_locations.map((location: any) => (
                  <Badge key={location.location} variant="outline">
                    {getLocationLabel(location.location)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Vídeos */}
            {advertisement.advertisement_videos?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Vídeos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {advertisement.advertisement_videos.map((video: any) => (
                    <div key={video.id} className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <video
                        src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/ad_videos/${video.video_url}`}
                        controls
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descrição */}
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-sm whitespace-pre-wrap">{advertisement.description}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};