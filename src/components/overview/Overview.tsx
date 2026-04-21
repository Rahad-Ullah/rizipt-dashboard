"use client";

import { useState } from "react";
import { Calendar, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CardStates from "./CardStates";
import RecentActivity from "./RecentActivity";
import UserGrowthChart from "./UserGrowthChart";





export default function Overview() {
  const [period, setPeriod] = useState("monthly");

  return (
    <div className=" py-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-semibold text-[#111827]">Dashboard Overview</h1>
          <p className="text-base text-gray-500 mt-1 font-medium">Real-time metrics from the Verdant network.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-40 h-10 px-4 bg-transparent py-5 font-semibold cursor-pointer border border-gray-200 rounded-sm text-[13px]  text-gray-600 shadow-sm transition-all focus:ring-1 focus:ring-gray-300 focus:border-gray-300 gap-2">
              <Calendar className="w-4 h-4 text-gray-700 shrink-0" strokeWidth={2.5} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-gray-100 shadow-xl bg-white font-normal">
              <SelectItem value="daily" className="font-normal">Last 7 Days</SelectItem>
              <SelectItem value="monthly" className="font-normal">Last 30 Days</SelectItem>
              <SelectItem value="yearly" className="font-normal">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <button className="w-full sm:w-auto h-10 px-5 bg-[#0094DA] text-white text-[13px] font-medium cursor-pointer rounded-sm shadow-sm hover:bg-[#007BB5] transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" strokeWidth={2.5} />
            Export
          </button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <CardStates />

      {/* ── Row 2: User Growth Chart ── */}
      <UserGrowthChart />

      {/* ── Row 3: Recent Activity ── */}
      <RecentActivity />

    </div>
  );
}
