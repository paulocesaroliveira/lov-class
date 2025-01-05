import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { DashboardFilters } from "./components/DashboardFilters";
import { MetricCards } from "./components/metrics/MetricCards";
import { UserDistributionChart } from "./components/charts/UserDistributionChart";
import { AdStatusChart } from "./components/charts/AdStatusChart";
import { EngagementTrendsChart } from "./components/charts/EngagementTrendsChart";
import { RegionalActivityChart } from "./components/charts/RegionalActivityChart";
import { useUserMetrics } from "./hooks/useUserMetrics";
import { useAdMetrics } from "./hooks/useAdMetrics";
import { useEngagementMetrics } from "./hooks/useEngagementMetrics";
import { useRegionalMetrics } from "./hooks/useRegionalMetrics";

export const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;

  const { data: userMetrics } = useUserMetrics(dateFilter);
  const { data: adMetrics } = useAdMetrics(dateFilter);
  const { data: engagementMetrics } = useEngagementMetrics(dateFilter);
  const { data: regionalMetrics } = useRegionalMetrics();

  const exportToCSV = () => {
    if (!userMetrics || !adMetrics || !engagementMetrics || !regionalMetrics) {
      toast.error("Não há dados para exportar");
      return;
    }

    const data = [
      ["Período", `${startDate || 'Início'} até ${endDate || 'Hoje'}`],
      [],
      ["Métricas de Usuários"],
      ["Total", "Ativos", "Inativos"],
      [userMetrics.totalUsers, userMetrics.activeUsers, userMetrics.inactiveUsers],
      [],
      ["Métricas de Anúncios"],
      ["Total", "Pendentes", "Aprovados", "Rejeitados", "Taxa de Aprovação"],
      [
        adMetrics.total,
        adMetrics.pending,
        adMetrics.approved,
        adMetrics.rejected,
        `${adMetrics.approvalRate.toFixed(1)}%`
      ],
      [],
      ["Métricas de Engajamento"],
      ["Data", "Visualizações Únicas", "Cliques WhatsApp"],
      ...engagementMetrics.map(metric => [
        format(new Date(metric.date), 'dd/MM/yyyy'),
        metric.unique_views,
        metric.whatsapp_clicks
      ]),
      [],
      ["Métricas Regionais"],
      ["Estado", "Cidade", "Visualizações", "Cliques", "Anúncios Ativos"],
      ...regionalMetrics.map(metric => [
        metric.state,
        metric.city,
        metric.view_count,
        metric.click_count,
        metric.active_ads
      ])
    ];

    const csvContent = data
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metricas_${format(new Date(), 'yyyy-MM-dd')}.csv`;
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
        onExport={exportToCSV}
      />

      <MetricCards 
        userMetrics={userMetrics}
        adMetrics={adMetrics}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <UserDistributionChart userMetrics={userMetrics} />
        <AdStatusChart adMetrics={adMetrics} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <EngagementTrendsChart engagementMetrics={engagementMetrics} />
        <RegionalActivityChart regionalMetrics={regionalMetrics} />
      </div>
    </div>
  );
};