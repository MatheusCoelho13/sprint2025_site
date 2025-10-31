import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative pt-10 pb-6 bg-red-500py-28 px-6 bg-gradient-to-t from-[#0a3d5a]/80 to-[#0f172a] text-center overflow-hidden">
      {/* Efeito de brilho de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(232,180,67,0.1),_transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_0%,rgba(15,23,42,0.9)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 container mx-auto max-w-4xl space-y-8"
      >
        {/* Título */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-[#eff5f5] leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
          Sua Próxima Aventura{" "}
          <span className="bg-gradient-to-r from-[#e8b443] to-[#3b7d46] bg-clip-text text-transparent">
            Começa Aqui
          </span>
        </h2>

        {/* Subtítulo */}
        <p className="text-xl text-[#a7b1b9] max-w-2xl mx-auto leading-relaxed">
          Entre em um mundo onde a imaginação não tem limites e cada experiência
          é única
        </p>

        {/* Botão principal com brilho */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-[#e8b443] via-[#3b7d46] to-[#1a5a7e] text-[#0f172a] font-bold text-xl px-12 py-8 rounded-2xl
              shadow-[0_0_20px_rgba(232,180,67,0.4)] transition-all duration-300"
          >
            {/* Reflexo diagonal animado */}
            <span className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.3)_50%,rgba(255,255,255,0)_100%)] translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-[1.2s] ease-in-out rounded-2xl" />

            <Sparkles className="w-6 h-6 mr-3 text-[#0f172a]" />
            Explorar Agora
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>

        {/* Infos extras */}
        <p className="text-sm text-[#a7b1b9] pt-2 flex justify-center gap-3 items-center flex-wrap">
          <span>⚡ Acesso instantâneo</span>•<span>🌟 100% seguro</span>•
          <span>🎮 Diversão garantida</span>
        </p>
      </motion.div>
    </section>
  );
};
