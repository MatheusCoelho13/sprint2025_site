import { motion, type Variants } from "framer-motion";
import React from "react";
import MatrixCodeCanvas from "./modules/Matrix_Content";

interface AnimatedMatrixBackgroundProps {
  className?: string;
}

// Animação de pulsação suave do fundo
const pulseVariants: Variants = {
  animate: {
    opacity: [0.85, 0.95, 0.8],
    scale: [1.0, 1.01, 1.0],
    transition: {
      duration: 25,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

const AnimatedMatrixBackground: React.FC<AnimatedMatrixBackgroundProps> = ({
  className = "",
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Camada base com gradiente Biotic */}
      <motion.div
        variants={pulseVariants}
        initial="animate"
        animate="animate"
        className="absolute inset-0 will-change-transform will-change-opacity"
        style={{
          background:
            // Gradiente azul-petróleo → azul-profundo com leve toque verde
            "radial-gradient(ellipse at center, rgba(23,79,40,0.25) 0%, rgba(10,61,90,0.65) 40%, rgba(10,35,68,0.9) 85%, #071933 100%)",
          boxShadow:
            "inset 0 0 180px rgba(59,125,70,0.35), 0 0 50px rgba(26,90,126,0.15)",
        }}
      >
        {/* Canvas do efeito de código binário */}
        <div
          style={{
            mixBlendMode: "screen", // Deixa o verde parecer luminoso
          }}
        >
          <MatrixCodeCanvas />
        </div>

        {/* Textura de linhas binárias verticais suaves */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(59,125,70,0.1) 0, transparent 1px, transparent 45px)",
            opacity: 0.25,
          }}
        ></div>

        {/* Camada leve de escurecimento geral para contraste de texto */}
        <div className="absolute inset-0 bg-[#0a2344]/60" />
      </motion.div>
    </div>
  );
};

export default AnimatedMatrixBackground;
