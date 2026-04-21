"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Store, ReceiptText, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { title: "TOTAL USERS", value: "12.4K", icon: Users, progress: 65, color: "bg-[#0094DA]" },
  { title: "TOTAL MERCHANTS", value: "450", icon: Store, progress: 40, color: "bg-[#0094DA]" },
  { title: "SCANNED RECEIPTS", value: "85.2K", icon: ReceiptText, progress: 85, color: "bg-[#0094DA]" },
  { title: "ACTIVE OFFERS", value: "120", icon: Tag, progress: 25, color: "bg-[#EAB308]" },
];

export default function CardStates() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
        >
          <Card className="rounded-2xl border-none shadow-sm h-full pt-6 pb-5 px-6 group hover:shadow-md transition-shadow duration-300 relative overflow-hidden bg-white/70 backdrop-blur-xl">
            {/* Background Icon (very subtle) */}
            <stat.icon className="absolute top-4 right-4 w-12 h-12 text-primary/15 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            
            <CardContent className="p-0 flex flex-col h-full justify-between relative z-10">
              <div className="space-y-1 mt-2">
                <p className="text-[11px] font-bold text-gray-500 tracking-wider">
                   {stat.title}
                </p>
                <p className="text-3xl font-bold text-[#111827]">
                   {stat.value}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-200 rounded-full mt-6 overflow-hidden">
                <motion.div 
                  className={cn("h-full rounded-full", stat.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
