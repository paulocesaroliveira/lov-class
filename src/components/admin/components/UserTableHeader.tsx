import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Profile } from "../types";

interface UserTableHeaderProps {
  onSort: (column: keyof Profile) => void;
  sortColumn: keyof Profile | null;
  sortDirection: 'asc' | 'desc';
}

export const UserTableHeader = ({
  onSort,
  sortColumn,
  sortDirection,
}: UserTableHeaderProps) => {
  const getSortIcon = (column: keyof Profile) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-4 h-4 ml-1" />;
    return <ArrowUpDown className={`w-4 h-4 ml-1 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort('name')}
            className="flex items-center hover:bg-transparent"
          >
            Nome
            {getSortIcon('name')}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort('role')}
            className="flex items-center hover:bg-transparent"
          >
            Papel
            {getSortIcon('role')}
          </Button>
        </TableHead>
        <TableHead>
          <Button 
            variant="ghost" 
            onClick={() => onSort('created_at')}
            className="flex items-center hover:bg-transparent"
          >
            Data de Criação
            {getSortIcon('created_at')}
          </Button>
        </TableHead>
        <TableHead>Ações</TableHead>
        <TableHead>Notas</TableHead>
      </TableRow>
    </TableHeader>
  );
};