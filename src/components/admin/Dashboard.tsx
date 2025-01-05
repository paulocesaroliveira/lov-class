import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
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
  const [isCompact, setIsCompact] = useState(false);
  const dateFilter = startDate || endDate ? { startDate, endDate } : undefined;

  const { data: userMetrics } = useUserMetrics(dateFilter);
  const { data: adMetricsData } = useAdMetrics(dateFilter);
  const { data: engagementMetrics } = useEngagementMetrics(dateFilter);
  const { data: regionalMetrics } = useRegionalMetrics();

  const prepareExportData = () => {
    if (!userMetrics || !adMetricsData || !engagementMetrics || !regionalMetrics) {
      toast.error("Não há dados para exportar");
      return null;
    }

    return [
      ["Período", `${startDate || 'Início'} até ${endDate || 'Hoje'}`],
      [],
      ["Métricas de Usuários"],
      ["Total", "Ativos", "Inativos", "Taxa de Atividade"],
      [
        userMetrics.totalUsers,
        userMetrics.activeUsers,
        userMetrics.inactiveUsers,
        `${((userMetrics.activeUsers / userMetrics.totalUsers) * 100).toFixed(1)}%`
      ],
      [],
      ["Métricas de Anúncios"],
      ["Total", "Pendentes", "Aprovados", "Rejeitados", "Taxa de Aprovação"],
      [
        adMetricsData?.current.total,
        adMetricsData?.current.pending,
        adMetricsData?.current.approved,
        adMetricsData?.current.rejected,
        `${adMetricsData?.current.approvalRate.toFixed(1)}%`
      ],
      [],
      ["Métricas de Engajamento"],
      ["Data", "Visualizações Únicas", "Visualizações Totais", "Cliques WhatsApp"],
      ...engagementMetrics.map(metric => [
        format(new Date(metric.date), 'dd/MM/yyyy'),
        metric.unique_views,
        metric.total_views,
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
  };

  const exportToCSV = () => {
    const data = prepareExportData();
    if (!data) return;

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
    toast.success("Dados exportados com sucesso em CSV");
  };

  const exportToExcel = () => {
    const data = prepareExportData();
    if (!data) return;

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Métricas");
    
    XLSX.writeFile(wb, `metricas_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    toast.success("Dados exportados com sucesso em Excel");
  };

  const handleExport = (format: "csv" | "excel") => {
    if (format === "csv") {
      exportToCSV();
    } else {
      exportToExcel();
    }
  };

  return (
    <div className="space-y-6">
      <DashboardFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onExport={handleExport}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact(!isCompact)}
      />

      <MetricCards 
        userMetrics={userMetrics}
        adMetrics={adMetricsData?.current}
        previousPeriod={{
          totalUsers: userMetrics?.previousPeriod?.totalUsers || 0,
          activeUsers: userMetrics?.previousPeriod?.activeUsers || 0,
          approvalRate: adMetricsData?.previous?.approvalRate || 0,
          pending: adMetricsData?.previous?.pending || 0,
        }}
      />

      <div className={`grid gap-4 ${isCompact ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2'}`}>
        <UserDistributionChart userMetrics={userMetrics} isCompact={isCompact} />
        <AdStatusChart adMetrics={adMetricsData?.current} isCompact={isCompact} />
        <EngagementTrendsChart engagementMetrics={engagementMetrics} isCompact={isCompact} />
        <RegionalActivityChart regionalMetrics={regionalMetrics} isCompact={isCompact} />
      </div>
    </div>
  );
};