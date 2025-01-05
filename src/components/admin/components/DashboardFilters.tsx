import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExport: (format: "csv" | "excel") => void;
}

export const DashboardFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
}: DashboardFiltersProps) => {
  const handlePresetChange = (value: string) => {
    const end = format(endOfDay(new Date()), "yyyy-MM-dd");
    let start;

    switch (value) {
      case "today":
        start = format(startOfDay(new Date()), "yyyy-MM-dd");
        break;
      case "7d":
        start = format(subDays(new Date(), 7), "yyyy-MM-dd");
        break;
      case "30d":
        start = format(subDays(new Date(), 30), "yyyy-MM-dd");
        break;
      case "90d":
        start = format(subDays(new Date(), 90), "yyyy-MM-dd");
        break;
      default:
        start = "";
    }

    onStartDateChange(start);
    onEndDateChange(end);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecionar período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="90d">Últimos 90 dias</SelectItem>
          <SelectItem value="custom">Personalizado</SelectItem>
        </SelectContent>
      </Select>

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

      <div className="flex gap-2 ml-auto">
        <Button variant="outline" onClick={() => onExport("csv")}>
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
        <Button variant="outline" onClick={() => onExport("excel")}>
          <Download className="w-4 h-4 mr-2" />
          Excel
        </Button>
      </div>
    </div>
  );
};