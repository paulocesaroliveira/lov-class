import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "../types";
import { toast } from "sonner";
import { useAdminRateLimit } from "./useAdminRateLimit";

export const useUserMutations = () => {
  const queryClient = useQueryClient();
  const { checkRateLimit } = useAdminRateLimit();

  const roleChangeMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const canProceed = await checkRateLimit('change_user_role');
      if (!canProceed) throw new Error('Rate limit exceeded');

      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;

      await supabase.from("user_activity_logs").insert({
        user_id: userId,
        action_type: "role_change",
        description: `Role changed to ${newRole}`,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Papel do usuário atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao atualizar papel do usuário:", error);
      toast.error("Erro ao atualizar papel do usuário");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log("Starting user deletion process for:", userId);
      
      const canProceed = await checkRateLimit('delete_user');
      if (!canProceed) throw new Error('Rate limit exceeded');

      try {
        // First check if user has any advertisements
        const { data: advertisements, error: adsError } = await supabase
          .from("advertisements")
          .select("id")
          .eq("profile_id", userId);

        if (adsError) {
          console.error("Error checking advertisements:", adsError);
          throw adsError;
        }

        console.log("Found advertisements:", advertisements?.length || 0);

        if (advertisements && advertisements.length > 0) {
          console.log("Deleting user's advertisements:", advertisements);
          
          // Delete all related data for each advertisement
          for (const ad of advertisements) {
            // Delete advertisement photos
            const { error: photosError } = await supabase
              .from("advertisement_photos")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (photosError) {
              console.error("Error deleting photos:", photosError);
              throw photosError;
            }

            // Delete advertisement videos
            const { error: videosError } = await supabase
              .from("advertisement_videos")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (videosError) {
              console.error("Error deleting videos:", videosError);
              throw videosError;
            }

            // Delete advertisement services
            const { error: servicesError } = await supabase
              .from("advertisement_services")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (servicesError) {
              console.error("Error deleting services:", servicesError);
              throw servicesError;
            }

            // Delete advertisement service locations
            const { error: locationsError } = await supabase
              .from("advertisement_service_locations")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (locationsError) {
              console.error("Error deleting locations:", locationsError);
              throw locationsError;
            }

            // Delete advertisement reviews
            const { error: reviewsError } = await supabase
              .from("advertisement_reviews")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (reviewsError) {
              console.error("Error deleting reviews:", reviewsError);
              throw reviewsError;
            }

            // Delete advertisement comments
            const { error: commentsError } = await supabase
              .from("advertisement_comments")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (commentsError) {
              console.error("Error deleting comments:", commentsError);
              throw commentsError;
            }

            // Delete advertisement views and clicks
            const { error: viewsError } = await supabase
              .from("advertisement_views")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (viewsError) {
              console.error("Error deleting views:", viewsError);
              throw viewsError;
            }

            const { error: clicksError } = await supabase
              .from("advertisement_whatsapp_clicks")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (clicksError) {
              console.error("Error deleting clicks:", clicksError);
              throw clicksError;
            }

            // Delete advertiser documents
            const { error: docsError } = await supabase
              .from("advertiser_documents")
              .delete()
              .eq("advertisement_id", ad.id);
            
            if (docsError) {
              console.error("Error deleting documents:", docsError);
              throw docsError;
            }

            // Finally delete the advertisement itself
            const { error: adError } = await supabase
              .from("advertisements")
              .delete()
              .eq("id", ad.id);
            
            if (adError) {
              console.error("Error deleting advertisement:", adError);
              throw adError;
            }
          }
        }

        // Delete user's admin notes
        const { error: notesError } = await supabase
          .from("admin_notes")
          .delete()
          .eq("user_id", userId);
        
        if (notesError) {
          console.error("Error deleting admin notes:", notesError);
          throw notesError;
        }

        // Delete user's activity logs
        const { error: logsError } = await supabase
          .from("user_activity_logs")
          .delete()
          .eq("user_id", userId);
        
        if (logsError) {
          console.error("Error deleting activity logs:", logsError);
          throw logsError;
        }

        // Delete user's role change history
        const { error: historyError } = await supabase
          .from("role_change_history")
          .delete()
          .eq("user_id", userId);
        
        if (historyError) {
          console.error("Error deleting role history:", historyError);
          throw historyError;
        }

        // Delete user's favorites
        const { error: favoritesError } = await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId);
        
        if (favoritesError) {
          console.error("Error deleting favorites:", favoritesError);
          throw favoritesError;
        }

        // Delete user's profile
        const { error: profileError } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userId);

        if (profileError) {
          console.error("Error deleting profile:", profileError);
          throw profileError;
        }

        // Finally, delete the auth user
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        
        if (authError) {
          console.error("Error deleting auth user:", authError);
          throw authError;
        }

        console.log("User deletion completed successfully");
        return true;
      } catch (error) {
        console.error("Error in deletion process:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Usuário excluído com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir usuário");
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ userId, note }: { userId: string; note: string }) => {
      const canProceed = await checkRateLimit('add_user_note');
      if (!canProceed) throw new Error('Rate limit exceeded');

      const { error } = await supabase.from("admin_notes").insert({
        user_id: userId,
        note,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Nota adicionada com sucesso");
    },
    onError: (error) => {
      console.error("Erro ao adicionar nota:", error);
      toast.error("Erro ao adicionar nota");
    },
  });

  return {
    roleChangeMutation,
    deleteUserMutation,
    addNoteMutation,
  };
};