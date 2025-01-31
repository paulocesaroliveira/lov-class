import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAdvertisementStats } from "@/hooks/useAdvertisement";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { AdvertisementSection } from "@/components/profile/AdvertisementSection";
import { PasswordChangeSection } from "@/components/profile/PasswordChangeSection";
import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Advertisement {
  id: string;
}

const Perfil = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuthContext();
  const queryClient = useQueryClient();

  const { data: advertisement, isLoading } = useQuery({
    queryKey: ['advertisement', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("advertisements")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching advertisement:", error);
        toast.error("Error loading advertisement data");
        return null;
      }

      return data as Advertisement | null;
    },
    enabled: !!user?.id,
  });

  const {
    totalViews,
    monthlyViews,
    totalWhatsappClicks,
    monthlyWhatsappClicks,
  } = useAdvertisementStats(advertisement?.id || null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      console.log("User not authenticated, redirecting to login");
      toast.error("You need to be logged in to access your profile");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Refresh data when component mounts or when user changes
  useEffect(() => {
    if (user?.id) {
      queryClient.invalidateQueries({ queryKey: ['advertisement', user.id] });
    }
  }, [user?.id, queryClient]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your ads and personal information
          </p>
        </div>
        
        {isAdmin && (
          <Button
            onClick={() => navigate("/admin")}
            variant="outline"
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin Panel
          </Button>
        )}
      </div>

      {advertisement && (
        <ProfileStats
          totalViews={totalViews}
          monthlyViews={monthlyViews}
          totalWhatsappClicks={totalWhatsappClicks}
          monthlyWhatsappClicks={monthlyWhatsappClicks}
        />
      )}

      <AdvertisementSection 
        hasAd={!!advertisement} 
        advertisementId={advertisement?.id || null} 
      />
      
      <PasswordChangeSection />
    </div>
  );
};

export default Perfil;