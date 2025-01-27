import React from "react";
import { useRegionalMetrics } from "./hooks/useRegionalMetrics";

interface RegionalMetric {
  city: string;
  view_count: number;
  click_count: number;
  active_ads: number;
}

export const Dashboard = () => {
  const { data: regionalData } = useRegionalMetrics();
  
  const regionalMetrics: RegionalMetric[] = regionalData || [];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionalMetrics.map((metric) => (
          <div key={metric.city} className="p-4 border rounded-lg">
            <h2 className="text-lg font-semibold">{metric.city}</h2>
            <p>Views: {metric.view_count}</p>
            <p>Clicks: {metric.click_count}</p>
            <p>Active Ads: {metric.active_ads}</p>
          </div>
        ))}
      </div>
    </div>
  );
};