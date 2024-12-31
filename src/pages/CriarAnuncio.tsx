import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const services = [
  { id: "beijo_na_boca", label: "Beijo na Boca" },
  { id: "beijo_grego", label: "Beijo Grego" },
  { id: "bondage", label: "Bondage" },
  { id: "chuva_dourada", label: "Chuva Dourada" },
  { id: "chuva_marrom", label: "Chuva Marrom" },
  { id: "dominacao", label: "Dominação" },
  { id: "acessorios_eroticos", label: "Acessórios Eróticos" },
  { id: "voyeurismo", label: "Voyeurismo" },
  { id: "permite_filmagem", label: "Permite Filmagem" },
  { id: "menage_casal", label: "Ménage (Casal)" },
  { id: "menage_dois_homens", label: "Ménage (c/ 2 Homens)" },
  { id: "roleplay", label: "Roleplay" },
  { id: "facefuck", label: "Facefuck" },
  { id: "oral_sem_preservativo", label: "Oral Sem Preservativo" },
  { id: "oral_com_preservativo", label: "Oral Com Preservativo" },
  { id: "massagem", label: "Massagem" },
  { id: "sexo_virtual", label: "Sexo Virtual" },
  { id: "orgia", label: "Orgia" },
  { id: "gangbang", label: "Gangbang" },
];

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  birthDate: z.string().refine((date) => {
    const birthDate = new Date(date);
    const age = Math.floor(
      (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    return age >= 18;
  }, "Você deve ter pelo menos 18 anos"),
  height: z
    .number()
    .min(100, "Altura mínima é 100cm")
    .max(250, "Altura máxima é 250cm"),
  weight: z
    .number()
    .min(30, "Peso mínimo é 30kg")
    .max(300, "Peso máximo é 300kg"),
  category: z.enum(["mulher", "trans", "homem"]),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  state: z.string().min(2, "Estado é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  hourlyRate: z.number().min(0, "Valor deve ser maior que zero"),
  customRateDescription: z.string().optional(),
  customRateValue: z.number().optional(),
  services: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
});

const CriarAnuncio = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Você precisa estar logado para criar um anúncio");
        navigate("/login");
        return;
      }

      // Upload profile photo
      let profilePhotoUrl = null;
      if (profilePhoto) {
        const { data: profilePhotoData, error: profilePhotoError } =
          await supabase.storage
            .from("profile_photos")
            .upload(`${user.id}/${Date.now()}`, profilePhoto);

        if (profilePhotoError) throw profilePhotoError;
        profilePhotoUrl = profilePhotoData.path;
      }

      // Create advertisement
      const { data: ad, error: adError } = await supabase
        .from("advertisements")
        .insert({
          profile_id: user.id,
          name: values.name,
          birth_date: values.birthDate,
          height: values.height,
          weight: values.weight,
          category: values.category,
          whatsapp: values.whatsapp,
          state: values.state,
          city: values.city,
          neighborhood: values.neighborhood,
          hourly_rate: values.hourlyRate,
          custom_rate_description: values.customRateDescription,
          custom_rate_value: values.customRateValue,
          description: values.description,
          profile_photo_url: profilePhotoUrl,
        })
        .select()
        .single();

      if (adError) throw adError;

      // Insert services
      const { error: servicesError } = await supabase
        .from("advertisement_services")
        .insert(
          values.services.map((service) => ({
            advertisement_id: ad.id,
            service,
          }))
        );

      if (servicesError) throw servicesError;

      // Upload photos
      if (photos.length > 0) {
        const photoUploads = photos.map((photo) =>
          supabase.storage
            .from("ad_photos")
            .upload(`${ad.id}/${Date.now()}-${photo.name}`, photo)
        );

        const photoResults = await Promise.all(photoUploads);
        const photoUrls = photoResults
          .map((result) => result.data?.path)
          .filter(Boolean);

        const { error: photosError } = await supabase
          .from("advertisement_photos")
          .insert(
            photoUrls.map((url) => ({
              advertisement_id: ad.id,
              photo_url: url,
            }))
          );

        if (photosError) throw photosError;
      }

      // Upload videos
      if (videos.length > 0) {
        const videoUploads = videos.map((video) =>
          supabase.storage
            .from("ad_videos")
            .upload(`${ad.id}/${Date.now()}-${video.name}`, video)
        );

        const videoResults = await Promise.all(videoUploads);
        const videoUrls = videoResults
          .map((result) => result.data?.path)
          .filter(Boolean);

        const { error: videosError } = await supabase
          .from("advertisement_videos")
          .insert(
            videoUrls.map((url) => ({
              advertisement_id: ad.id,
              video_url: url,
            }))
          );

        if (videosError) throw videosError;
      }

      toast.success("Anúncio criado com sucesso!");
      navigate("/anuncios");
    } catch (error) {
      console.error("Error creating advertisement:", error);
      toast.error("Erro ao criar anúncio. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Criar Anúncio</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para criar seu anúncio
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Informações Básicas</h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="170"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="65"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mulher">Mulher</SelectItem>
                      <SelectItem value="trans">Trans</SelectItem>
                      <SelectItem value="homem">Homem</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Contato e Localização</h2>

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(11) 99999-9999"
                      {...field}
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Valores</h2>

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Hora</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="200"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customRateDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Valor Personalizado</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Pernoite"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customRateValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Personalizado</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="500"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Serviços</h2>

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <FormField
                        key={service.id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          service.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== service.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {service.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Descrição</h2>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Atendimento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva seu atendimento..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="glass-card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Fotos e Vídeos</h2>

            <div className="space-y-4">
              <div>
                <FormLabel>Foto de Perfil</FormLabel>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfilePhoto(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>

              <div>
                <FormLabel>Álbum de Fotos (máximo 15)</FormLabel>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 15) {
                        toast.error("Máximo de 15 fotos permitido");
                        return;
                      }
                      setPhotos(files);
                    }}
                  />
                </div>
              </div>

              <div>
                <FormLabel>Álbum de Vídeos (máximo 8)</FormLabel>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 8) {
                        toast.error("Máximo de 8 vídeos permitido");
                        return;
                      }
                      setVideos(files);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando anúncio...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Criar Anúncio
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CriarAnuncio;