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

// Efeito de pulsação mais suave
const pulseVariants: Variants = {
  animate: {
    opacity: [0.9, 0.95, 0.9],
    scale: [1.0, 1.005, 1.0],
    transition: {
      duration: 30,
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

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  // Parallax com amplitude reduzida (menos distrativo)
  const translateX = useTransform(smoothX, [0, window.innerWidth], [-10, 10]);
  const translateY = useTransform(smoothY, [0, window.innerHeight], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Suporte a giroscópio para mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma && e.beta) {
        mouseX.set(window.innerWidth / 2 + e.gamma * 5);
        mouseY.set(window.innerHeight / 2 + e.beta * 5);
      }
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
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
        {/* Gradiente simplificado (menos contraste, ideal para leitura) */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(10,61,90,0.8) 0%, rgba(7,25,51,0.95) 100%)",
            boxShadow:
              "inset 0 0 100px rgba(59,125,70,0.25), 0 0 30px rgba(26,90,126,0.1)",
          }}
          className="absolute inset-0"
        />

        {/* Canvas Matrix menos denso */}
        <div
          className="absolute inset-0"
          style={{
            mixBlendMode: "screen",
            opacity: 0.4, // reduz intensidade para não competir com o texto
          }}
        >
          <MatrixCodeCanvas />
        </div>

        {/* Linhas verticais suaves */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(59,125,70,0.05) 0, transparent 1px, transparent 50px)",
            opacity: 0.15,
          }}
        />

        {/* Camada de escurecimento leve */}
        <div className="absolute inset-0 bg-[#0a2344]/50" />
      </motion.div>
    </div>
  );
};

export default AnimatedMatrixBackground;
