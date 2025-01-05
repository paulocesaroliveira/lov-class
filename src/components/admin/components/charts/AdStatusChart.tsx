import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface AdMetrics {
  pending: number;
  approved: number;
  rejected: number;
}

interface AdStatusChartProps {
  adMetrics?: AdMetrics;
}

export const AdStatusChart = ({ adMetrics }: AdStatusChartProps) => {
  const chartData = [
    {
      name: "Pendentes",
      value: adMetrics?.pending || 0,
      color: "#f59e0b",
    },
    {
      name: "Aprovados",
      value: adMetrics?.approved || 0,
      color: "#22c55e",
    },
    {
      name: "Rejeitados",
      value: adMetrics?.rejected || 0,
      color: "#ef4444",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Anúncios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};