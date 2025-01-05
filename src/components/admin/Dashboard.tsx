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