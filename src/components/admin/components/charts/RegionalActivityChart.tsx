import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface RegionalActivityChartProps {
  regionalMetrics?: any[];
  isCompact: boolean;
}

export const RegionalActivityChart = ({ regionalMetrics, isCompact }: RegionalActivityChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Regional</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regionalMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="view_count" fill="#2563eb" name="Visualizações" />
              <Bar dataKey="click_count" fill="#16a34a" name="Cliques" />
              <Bar dataKey="active_ads" fill="#ea580c" name="Anúncios Ativos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};