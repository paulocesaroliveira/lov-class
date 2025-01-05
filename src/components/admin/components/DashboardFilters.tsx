import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface DashboardFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExport: () => void;
}

export const DashboardFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: DashboardFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-40"
        />
        <span>até</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-40"
        />
      </div>
      <Button variant="outline" onClick={onExport} className="ml-auto">
        <Download className="w-4 h-4 mr-2" />
        Exportar Dados
      </Button>
    </div>
  );
};