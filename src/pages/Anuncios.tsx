import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const Anuncios = () => {
  const { data: advertisements, isLoading } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("advertisements")
        .select(`
          *,
          advertisement_services (
            service
          ),
          advertisement_photos (
            photo_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching advertisements:", error);
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Anúncios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Anúncios</h1>
      
      {advertisements && advertisements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advertisements.map((ad) => (
            <Link key={ad.id} to={`/anuncio/${ad.id}`}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">{ad.name}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {ad.city}, {ad.state}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(ad.created_at), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] relative rounded-md overflow-hidden bg-muted">
                    {ad.profile_photo_url ? (
                      <img
                        src={`https://keqcfrpqctyfxpfoxrkp.supabase.co/storage/v1/object/public/profile_photos/${ad.profile_photo_url}`}
                        alt={ad.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="font-semibold">R$ {ad.hourly_rate}/hora</div>
                    <div className="line-clamp-2 text-sm text-muted-foreground mt-2">
                      {ad.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum anúncio encontrado</p>
        </div>
      )}
    </div>
  );
};

export default Anuncios;