import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdvertisementCard } from "./AdvertisementCard";
import { Advertisement } from "@/types/advertisement";

export const AdvertisementList = () => {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        let query = supabase
          .from("advertisements")
          .select("*");

        // Only filter out blocked ads on the Anuncios page
        if (location.pathname === "/anuncios") {
          query = query.eq("blocked", false);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching advertisements:", error);
          return;
        }

        setAdvertisements(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, [location.pathname]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {advertisements.map((advertisement) => (
        <AdvertisementCard key={advertisement.id} advertisement={advertisement} />
      ))}
    </div>
  );
};