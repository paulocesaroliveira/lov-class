import { useAdminStats } from "../hooks/useAdminStats";

export const AdminStats = () => {
  const { data: stats } = useAdminStats();

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
        <span className="text-sm">
          Anunciantes: <strong>{stats?.advertisers || 0}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-4 py-2">
        <span className="text-sm">
          Revisões Pendentes: <strong>{stats?.pendingReviews || 0}</strong>
        </span>
      </div>
    </div>
  );
};