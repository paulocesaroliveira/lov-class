import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EngagementTrendsChartProps {
  engagementMetrics?: any[];
  isCompact: boolean;
}

export const EngagementTrendsChart = ({ engagementMetrics, isCompact }: EngagementTrendsChartProps) => {
  if (!engagementMetrics?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tendências de Engajamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Sem dados disponíveis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendências de Engajamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="unique_views"
                stroke="#2563eb"
                name="Visualizações Únicas"
              />
              <Line
                type="monotone"
                dataKey="total_views"
                stroke="#16a34a"
                name="Visualizações Totais"
              />
              <Line
                type="monotone"
                dataKey="whatsapp_clicks"
                stroke="#ea580c"
                name="Cliques WhatsApp"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};