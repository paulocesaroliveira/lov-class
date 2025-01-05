import { useState } from "react";
import { Users, FileCheck, Clock } from "lucide-react";
import { MetricCard } from "./cards/MetricCard";

interface MetricCardsProps {
  userMetrics?: {
    totalUsers: number;
    activeUsers: number;
  };
  adMetrics?: {
    approvalRate: number;
    pending: number;
  };
  previousPeriod?: {
    totalUsers: number;
    activeUsers: number;
    approvalRate: number;
    pending: number;
  };
}

export const MetricCards = ({ userMetrics, adMetrics, previousPeriod }: MetricCardsProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const metrics = [
    {
      id: 'totalUsers',
      title: 'Total Usuários',
      value: userMetrics?.totalUsers || 0,
      previousValue: previousPeriod?.totalUsers,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      tooltipContent: 'Número total de usuários registrados na plataforma',
      expandedContent: expandedCards.totalUsers && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>Período anterior: {previousPeriod?.totalUsers}</p>
          <p>Média diária: {Math.round((userMetrics?.totalUsers || 0) / 30)}</p>
        </div>
      )
    },
    {
      id: 'activeUsers',
      title: 'Usuários Ativos',
      value: userMetrics?.activeUsers || 0,
      previousValue: previousPeriod?.activeUsers,
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      tooltipContent: 'Usuários ativos nos últimos 30 dias',
      expandedContent: expandedCards.activeUsers && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>Período anterior: {previousPeriod?.activeUsers}</p>
          <p>Taxa de atividade: {((userMetrics?.activeUsers || 0) / (userMetrics?.totalUsers || 1) * 100).toFixed(1)}%</p>
        </div>
      )
    },
    {
      id: 'approvalRate',
      title: 'Taxa de Aprovação',
      value: `${adMetrics?.approvalRate.toFixed(1)}%` || '0%',
      previousValue: previousPeriod?.approvalRate,
      icon: <FileCheck className="h-4 w-4 text-muted-foreground" />,
      tooltipContent: 'Percentual de anúncios aprovados em relação ao total',
      expandedContent: expandedCards.approvalRate && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>Período anterior: {previousPeriod?.approvalRate.toFixed(1)}%</p>
          <p>Variação: {((adMetrics?.approvalRate || 0) - (previousPeriod?.approvalRate || 0)).toFixed(1)}%</p>
        </div>
      )
    },
    {
      id: 'pending',
      title: 'Anúncios Pendentes',
      value: adMetrics?.pending || 0,
      previousValue: previousPeriod?.pending,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      tooltipContent: 'Anúncios aguardando revisão',
      expandedContent: expandedCards.pending && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>Período anterior: {previousPeriod?.pending}</p>
          <p>Tempo médio de espera: 24h</p>
        </div>
      )
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map(metric => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          tooltipContent={metric.tooltipContent}
          previousValue={metric.previousValue}
          isExpanded={!!expandedCards[metric.id]}
          onToggleExpand={() => toggleCard(metric.id)}
          expandedContent={metric.expandedContent}
        />
      ))}
    </div>
  );
};