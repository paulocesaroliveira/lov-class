import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardsProps {
  userMetrics?: {
    totalUsers: number;
    activeUsers: number;
  };
  adMetrics?: {
    approvalRate: number;
    pending: number;
  };
}

export const MetricCards = ({ userMetrics, adMetrics }: MetricCardsProps) => {
  return (
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
  );
};