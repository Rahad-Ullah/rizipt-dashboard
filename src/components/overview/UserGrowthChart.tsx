"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { useUserGrothQuery } from "@/features/overview/overviewApi";

export default function UserGrowthChart() {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { data: userGrowthRes, isLoading, isFetching } = useUserGrothQuery(selectedYear);

    const growthData = userGrowthRes?.data;
    const displayData = Array.isArray(growthData)
        ? growthData.map((item: { monthName: string; count: number }) => ({
            label: item.monthName.toUpperCase(),
            value: item.count,
        }))
        : [];

    const availableYears = [2024, 2025, 2026];

    return (
        <div className="bg-white border border-gray-200/60 rounded-2xl p-6 text-2xl md:p-8 mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-[17px] font-bold text-gray-900">User Growth</h3>
                    <p className="text-[13px] text-gray-500 font-medium mt-1">
                        Monthly user acquisitions for year {selectedYear}
                    </p>
                </div>

                {/* Animated Year Toggle */}
                <div className="flex items-center bg-gray-200/70 rounded-full p-1 relative shadow-inner">
                    {availableYears.map((year) => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            className={`relative px-5 py-1.5 text-[13px] cursor-pointer font-bold transition-colors z-10 rounded-full ${selectedYear === year ? "text-[#0094DA]" : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {selectedYear === year && (
                                <motion.div
                                    layoutId="year-bubble"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            {year}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart */}
            <div className="h-80 w-full relative">
                {(isLoading || isFetching) && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-20 rounded-xl">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-7 h-7 border-3 border-[#0094DA] border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-semibold text-gray-500">Loading chart data...</p>
                        </div>
                    </div>
                )}

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={displayData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        onMouseMove={(state) => {
                            if (state.isTooltipActive && typeof state.activeTooltipIndex === "number") {
                                setActiveIndex(state.activeTooltipIndex);
                            } else {
                                setActiveIndex(null);
                            }
                        }}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: "bold" }}
                            dy={15}
                        />
                        <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                                backgroundColor: "#fff",
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
                                padding: "12px 16px",
                                fontWeight: "bold",
                                color: "#111827",
                                fontSize: "14px"
                            }}
                            labelStyle={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}
                            itemStyle={{ color: "#0094DA" }}
                        />
                        <Bar
                            dataKey="value"
                            radius={[4, 4, 4, 4]}
                            barSize={32}
                            animationDuration={800}
                        >
                            {displayData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIndex === index ? "#0094DA" : "#B2D6E4"}
                                    className="transition-colors duration-300"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}