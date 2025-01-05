import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

interface EngagementTrendsChartProps {
  engagementMetrics?: any[];
}

export const EngagementTrendsChart = ({ engagementMetrics }: EngagementTrendsChartProps) => {
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
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(new Date(date), 'dd/MM')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy')}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="unique_views" 
                stroke="#22c55e" 
                name="Visualizações Únicas"
              />
              <Line 
                type="monotone" 
                dataKey="whatsapp_clicks" 
                stroke="#f59e0b" 
                name="Cliques WhatsApp"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};