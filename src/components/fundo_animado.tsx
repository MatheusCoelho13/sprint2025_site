import React, { useEffect, useState } from "react";
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
  const [gyroEnabled, setGyroEnabled] = useState(false);
  const mouseX = useMotionValue(window.innerWidth / 2);
  const mouseY = useMotionValue(window.innerHeight / 2);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const translateX = useTransform(smoothX, [0, window.innerWidth], [-25, 25]);
  const translateY = useTransform(smoothY, [0, window.innerHeight], [-25, 25]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  useEffect(() => {
    let vrSession: XRSession | null = null;

    const enableMobileGyro = () => {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          mouseX.set(window.innerWidth / 2 + e.gamma * 15);
          mouseY.set(window.innerHeight / 2 + e.beta * 15);
        }
      };
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    };

    const enableVRHeadTracking = async () => {
      if ("xr" in navigator) {
        try {
          const supported = await (navigator as any).xr.isSessionSupported("inline");
          if (supported) {
            vrSession = await (navigator as any).xr.requestSession("inline");
            if (vrSession) {
              const refSpace = await vrSession.requestReferenceSpace("viewer");
              vrSession.requestAnimationFrame(function loop(_, frame) {
                const pose = frame.getViewerPose(refSpace);
                if (pose) {
                  const { x, y } = pose.transform.position;
                  mouseX.set(window.innerWidth / 2 + x * 120);
                  mouseY.set(window.innerHeight / 2 + y * 120);
                }
                if (vrSession) {
                  vrSession.requestAnimationFrame(loop);
                }
              });
            } else {
              console.warn("VR session was not created.");
            }
          }
        } catch (err) {
          console.warn("WebXR não disponível:", err);
        }
      }
    };

    // Se já tiver permissão, ativa imediatamente
    if (typeof DeviceOrientationEvent !== "undefined") {
      if (
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        // iOS exige permissão explícita
        console.log("Aguardando permissão de giroscópio...");
      } else {
        enableVRHeadTracking();
        const removeGyro = enableMobileGyro();
        setGyroEnabled(true);
        return () => {
          if (vrSession) vrSession.end();
          removeGyro?.();
        };
      }
    }
  }, []);

  // Função para pedir permissão (iOS)
  const requestGyroPermission = async () => {
    try {
      const permission = await (DeviceOrientationEvent as any).requestPermission();
      if (permission === "granted") {
        setGyroEnabled(true);
        console.log("Permissão concedida");
        const handleOrientation = (e: DeviceOrientationEvent) => {
          if (e.gamma !== null && e.beta !== null) {
            mouseX.set(window.innerWidth / 2 + e.gamma * 15);
            mouseY.set(window.innerHeight / 2 + e.beta * 15);
          }
        };
        window.addEventListener("deviceorientation", handleOrientation);
      } else {
        alert("Permissão negada. Ative nas configurações do navegador.");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão do giroscópio:", error);
    }
  };

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Botão de ativação de giroscópio (apenas em iOS e VR browsers) */}
      {!gyroEnabled && typeof DeviceOrientationEvent !== "undefined" && (
        <div className="absolute z-50 top-6 left-1/2 -translate-x-1/2 bg-[#0a2344]/80 px-6 py-3 rounded-2xl text-[#e8b443] border border-[#3b7d46]/60 backdrop-blur-md">
          <button
            onClick={requestGyroPermission}
            className="font-semibold tracking-wide"
          >
            Ativar Giroscópio 🔄
          </button>
        </div>
      )}

      <motion.div
        variants={pulseVariants}
        initial="animate"
        animate="animate"
        style={{ translateX, translateY }}
        className="absolute inset-0 will-change-transform will-change-opacity"
      >
        {/* Fundo animado e Matrix */}
        <div
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(23,79,40,0.25) 0%, rgba(10,61,90,0.65) 40%, rgba(10,35,68,0.9) 85%, #071933 100%)",
            boxShadow:
              "inset 0 0 180px rgba(59,125,70,0.35), 0 0 50px rgba(26,90,126,0.15)",
          }}
          className="absolute inset-0"
        />

        <div className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          <MatrixCodeCanvas />
        </div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(59,125,70,0.1) 0, transparent 1px, transparent 45px)",
            opacity: 0.25,
          }}
        />

        <div className="absolute inset-0 bg-[#0a2344]/60" />
      </motion.div>
    </div>
  );
};

export default AnimatedMatrixBackground;
