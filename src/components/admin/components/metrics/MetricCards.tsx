import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Users, FileCheck, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  const renderChangeIndicator = (current: number, previous: number) => {
    const change = calculateChange(current, previous);
    if (!change) return null;

    const isPositive = parseFloat(change) > 0;
    return (
      <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
      </span>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <TooltipProvider>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Users className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Número total de usuários registrados na plataforma</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{userMetrics?.totalUsers}</div>
              {previousPeriod && renderChangeIndicator(
                userMetrics?.totalUsers || 0,
                previousPeriod.totalUsers
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toggleCard('totalUsers')}
            >
              {expandedCards.totalUsers ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedCards.totalUsers && (
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>Período anterior: {previousPeriod?.totalUsers}</p>
                <p>Média diária: {Math.round((userMetrics?.totalUsers || 0) / 30)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Users className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Usuários ativos nos últimos 30 dias</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{userMetrics?.activeUsers}</div>
              {previousPeriod && renderChangeIndicator(
                userMetrics?.activeUsers || 0,
                previousPeriod.activeUsers
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toggleCard('activeUsers')}
            >
              {expandedCards.activeUsers ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedCards.activeUsers && (
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>Período anterior: {previousPeriod?.activeUsers}</p>
                <p>Taxa de atividade: {((userMetrics?.activeUsers || 0) / (userMetrics?.totalUsers || 1) * 100).toFixed(1)}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Percentual de anúncios aprovados em relação ao total</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {adMetrics?.approvalRate.toFixed(1)}%
              </div>
              {previousPeriod && renderChangeIndicator(
                adMetrics?.approvalRate || 0,
                previousPeriod.approvalRate
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toggleCard('approvalRate')}
            >
              {expandedCards.approvalRate ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedCards.approvalRate && (
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>Período anterior: {previousPeriod?.approvalRate.toFixed(1)}%</p>
                <p>Variação: {((adMetrics?.approvalRate || 0) - (previousPeriod?.approvalRate || 0)).toFixed(1)}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anúncios Pendentes</CardTitle>
            <Tooltip>
              <TooltipTrigger>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Anúncios aguardando revisão</p>
              </TooltipContent>
            </Tooltip>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{adMetrics?.pending}</div>
              {previousPeriod && renderChangeIndicator(
                adMetrics?.pending || 0,
                previousPeriod.pending
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              onClick={() => toggleCard('pending')}
            >
              {expandedCards.pending ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            {expandedCards.pending && (
              <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                <p>Período anterior: {previousPeriod?.pending}</p>
                <p>Tempo médio de espera: 24h</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
};