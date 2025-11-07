// src/components/SubTitle.tsx
// 💡 Subtítulo destacado e fluido — cria uma sensação de imersão e curiosidade visual.
// Corrigido: JSX fechado corretamente + animação suave e legível.

import React from "react";
import { motion } from "framer-motion";

const SubTitle: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 52,
        delay: 0.54,
      }}
      className="text-center"
    >
      <motion.p
        className="text-2xl md:text-3xl text-[#eff5f5] max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg"
      >
        Viaje por realidades impossíveis e descubra mundos que só existem na sua imaginação.
      </motion.p>


      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="mt-4 h-1 w-24 mx-auto bg-gradient-to-r from-[#e8b443] via-[#3b7d46] to-[#1a5a7e] rounded-full blur-[2px]"
      />
    </motion.div>
  );
};

export default SubTitle;
