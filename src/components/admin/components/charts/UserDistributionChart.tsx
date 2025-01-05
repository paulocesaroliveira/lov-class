import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface UserMetrics {
  activeUsers: number;
  inactiveUsers: number;
}

interface UserDistributionChartProps {
  userMetrics?: UserMetrics;
  isCompact: boolean;
}

export const UserDistributionChart = ({ userMetrics, isCompact }: UserDistributionChartProps) => {
  const chartData = [
    {
      name: "Ativos",
      value: userMetrics?.activeUsers || 0,
      color: "#22c55e",
    },
    {
      name: "Inativos",
      value: userMetrics?.inactiveUsers || 0,
      color: "#ef4444",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
};
