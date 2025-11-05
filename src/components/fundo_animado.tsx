import React, { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type Variants,
} from "framer-motion";
import MatrixCodeCanvas from "./modules/Matrix_Content";

interface AnimatedMatrixBackgroundProps {
  className?: string;
}

// Efeito de pulsação sutil no fundo
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
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  // Suavização com molas
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax leve (−25px a +25px)
  const translateX = useTransform(smoothX, [0, window.innerWidth], [-25, 25]);
  const translateY = useTransform(smoothY, [0, window.innerHeight], [-25, 25]);

  // Movimento do mouse
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Centraliza ao carregar
  useEffect(() => {
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);
  }, []);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        variants={pulseVariants}
        initial="animate"
        animate="animate"
        style={{ translateX, translateY }}
        className="absolute inset-0 will-change-transform will-change-opacity"
      >
        {/* Fundo em gradiente com efeito Matrix */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(23,79,40,0.25) 0%, rgba(10,61,90,0.65) 40%, rgba(10,35,68,0.9) 85%, #071933 100%)",
            boxShadow:
              "inset 0 0 180px rgba(59,125,70,0.35), 0 0 50px rgba(26,90,126,0.15)",
          }}
          className="absolute inset-0"
        />

        {/* Canvas Matrix */}
        <div className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          <MatrixCodeCanvas />
        </div>

        {/* Linhas de grade sutis */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(59,125,70,0.1) 0, transparent 1px, transparent 45px)",
            opacity: 0.25,
          }}
        />

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-[#0a2344]/60" />
      </motion.div>
    </div>
  );
};

export default AnimatedMatrixBackground;
