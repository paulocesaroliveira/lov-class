import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "../types";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRole: UserRole | "all";
  setSelectedRole: (value: UserRole | "all") => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  onExportData: () => void;
}

export const UserFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  selectedDate,
  setSelectedDate,
  onExportData,
}: UserFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <Input
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedRole} onValueChange={(value: UserRole | "all") => setSelectedRole(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Filtrar role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="user">Cliente</SelectItem>
            <SelectItem value="advertiser">Anunciante</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="max-w-xs"
        />
        <div className="ml-auto">
          <ExportActions />
        </div>
      </div>
    </div>
  );
};