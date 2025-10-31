import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  glowColor: string;
  index?: number;
}

export const Cards: React.FC<Feature> = ({
  icon: Icon,
  title,
  description,
  bgColor,
  borderColor,
  iconBg,
  glowColor,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -10, scale: 1.05 }}
    >
      <Card
        className={`relative ${bgColor} border ${borderColor} p-10 h-full rounded-2xl 
        backdrop-blur-lg overflow-hidden group transition-all duration-300 
        hover:shadow-[0_0_35px_-5px_${glowColor}] hover:border-[#eff5f5]/60
        hover:scale-105`}
      >
        {/* Efeito Glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl"
          style={{
            background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Ícone */}
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${iconBg} flex items-center justify-center mb-8 shadow-2xl 
            group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300`}
        >
          <Icon className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
        </div>

        {/* Título */}
        <h3 className="text-2xl font-bold text-[#eff5f5] mb-3 drop-shadow-[0_0_6px_rgba(255,255,255,0.15)]">
          {title}
        </h3>

        {/* Descrição */}
        <p className="text-[#cdd4db] text-lg leading-relaxed group-hover:text-[#eff5f5] transition-colors duration-300">
          {description}
        </p>
      </Card>
    </motion.div>
  );
};
