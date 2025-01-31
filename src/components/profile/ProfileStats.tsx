import { ChartBar, MessageSquareMore } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  totalViews: number;
  monthlyViews: number;
  totalWhatsappClicks: number;
  monthlyWhatsappClicks: number;
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
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-primary/10">
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Views</p>
              <p className="text-2xl font-bold">{monthlyViews}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-primary/10">
              <ChartBar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-whatsapp/10">
              <MessageSquareMore className="h-4 w-4 text-whatsapp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly WhatsApp Clicks</p>
              <p className="text-2xl font-bold">{monthlyWhatsappClicks}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-whatsapp/10">
              <MessageSquareMore className="h-4 w-4 text-whatsapp" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total WhatsApp Clicks</p>
              <p className="text-2xl font-bold">{totalWhatsappClicks}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};