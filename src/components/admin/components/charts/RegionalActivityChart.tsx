import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RegionalActivityChartProps {
  regionalMetrics?: any[];
}

export const RegionalActivityChart = ({ regionalMetrics }: RegionalActivityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade por Região</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalMetrics?.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="view_count" 
                fill="#22c55e" 
                name="Visualizações"
              />
              <Bar 
                dataKey="click_count" 
                fill="#f59e0b" 
                name="Cliques"
              />
              <Bar 
                dataKey="active_ads" 
                fill="#3b82f6" 
                name="Anúncios Ativos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};