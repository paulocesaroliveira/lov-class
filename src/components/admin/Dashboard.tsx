import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMetrics } from "./hooks/useAdminMetrics";
import { DashboardFilters } from "./components/DashboardFilters";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { userMetrics, adMetrics, engagementMetrics, regionalMetrics } = useAdminMetrics(
    startDate || endDate ? { startDate, endDate } : undefined
  );

  const userChartData = [
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

  const adChartData = [
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

  const handleExport = () => {
    if (!userMetrics || !adMetrics || !engagementMetrics || !regionalMetrics) {
      toast.error("Não há dados para exportar");
      return;
    }

    const data = {
      período: `${startDate || 'Início'} até ${endDate || 'Hoje'}`,
      métricas_usuários: {
        total: userMetrics.totalUsers,
        ativos: userMetrics.activeUsers,
        inativos: userMetrics.inactiveUsers,
      },
      métricas_anúncios: {
        total: adMetrics.total,
        pendentes: adMetrics.pending,
        aprovados: adMetrics.approved,
        rejeitados: adMetrics.rejected,
        taxa_aprovação: `${adMetrics.approvalRate.toFixed(1)}%`,
      },
      métricas_engajamento: engagementMetrics,
      métricas_regionais: regionalMetrics,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metricas_${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Dados exportados com sucesso");
  };

  return (
    <div className="space-y-6">
      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExport={handleExport}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMetrics?.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userMetrics?.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {adMetrics?.approvalRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anúncios Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adMetrics?.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Anúncios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value">
                    {adChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Novas visualizações */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>
    </div>
  );
};
