// src/components/Title.tsx
// 💡 Título impactante com animação suave e destaque visual.
// Corrigido: JSX fechado corretamente, 'transition' escrito certo e estrutura simplificada.

import React from "react";
import { motion } from "framer-motion";

const Title: React.FC = () => {
  const transition = {
    duration: 0.8,
    delay: 0.2,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  return (
    <div className="relative inline-block">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
              transition={{
                  default: { type: 'spring', stiffness: 50 },
                  opacity : { ease: 'linear', duration: 0.5}
              }
       
        }
        className="text-center"
      >
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e8b443] via-[#3b7d46] to-[#1a5a7e] mb-6 animate-pulse drop-shadow-lg">
          BIOTIC
        </h1>
      </motion.div>

      {/* Aura suave atrás do título */}
      <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#e8b443]/30 via-[#3b7d46]/30 to-[#1a5a7e]/30 -z-10" />
    </div>
  );
};

export default Title;
