import React from "react";

export interface DashboardFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onExport: (format: "csv" | "excel") => void;
  isCompact: boolean;
  onToggleCompact: () => void;
}

export const DashboardFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onExport,
  isCompact,
  onToggleCompact,
}: DashboardFiltersProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="border rounded p-2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <button onClick={() => onExport("csv")} className="btn">
          Exportar CSV
        </button>
        <button onClick={() => onExport("excel")} className="btn">
          Exportar Excel
        </button>
        <button onClick={onToggleCompact} className="btn">
          {isCompact ? "Expandir" : "Compactar"}
        </button>
      </div>
    </div>
  );
};
