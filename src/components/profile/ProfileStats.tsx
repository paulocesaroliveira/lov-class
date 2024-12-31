import { ChartBar, MessageSquareMore } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  totalViews: number | undefined;
  monthlyViews: number | undefined;
  totalWhatsappClicks: number | undefined;
  monthlyWhatsappClicks: number | undefined;
}

export const ProfileStats = ({
  totalViews,
  monthlyViews,
  totalWhatsappClicks,
  monthlyWhatsappClicks,
}: ProfileStatsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartBar className="w-5 h-5 text-primary" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-primary/10">
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visualizações do mês</p>
              <p className="text-2xl font-bold">{monthlyViews || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-primary/10">
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visualizações total</p>
              <p className="text-2xl font-bold">{totalViews || 0}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-whatsapp/10">
              <MessageSquareMore className="h-4 w-4 text-whatsapp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliques WhatsApp do mês</p>
              <p className="text-2xl font-bold">{monthlyWhatsappClicks || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-whatsapp/10">
              <MessageSquareMore className="h-4 w-4 text-whatsapp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliques WhatsApp total</p>
              <p className="text-2xl font-bold">{totalWhatsappClicks || 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};