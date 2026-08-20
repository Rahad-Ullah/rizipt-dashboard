"use client";

import CardStates from "./CardStates";
import UserGrowthChart from "./UserGrowthChart";

export default function Overview() {
  return (
    <div className="py-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-[#111827]">Dashboard Overview</h1>
          <p className="text-base text-gray-500 mt-1 font-medium">Real-time metrics from the Verdant network.</p>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <CardStates />

      {/* ── Row 2: User Growth Chart ── */}
      <UserGrowthChart />
    </div>
  );
}
