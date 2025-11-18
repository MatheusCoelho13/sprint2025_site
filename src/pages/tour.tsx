import React, { useEffect, useState } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isQuest, setIsQuest] = useState(false);

  // Detectar dispositivos e Quest
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const questDetected = /OculusBrowser|Meta Quest|Quest|Oculus|Wolvic/i.test(ua);

    const mobileDetected =
      ("userAgentData" in navigator
        ? (navigator as any).userAgentData?.mobile
        : undefined) ?? /Mobi|Android/i.test(ua);

    setIsQuest(questDetected);
    setIsMobileDevice(mobileDetected);
  }, []);

  // Tela Mobile → precisa pedir permissão de giroscópio
  async function handleEnable() {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permission = await (DeviceOrientationEvent as any).requestPermission();

        if (permission === "granted") {
          setHasPermission(true);
        } else {
          alert("❌ Permissão negada. Vá em Configurações → Movimento do sensor e ative.");
        }
      } else {
        // Android antigo / Chrome mobile → libera direto
        setHasPermission(true);
      }
    } catch (err) {
      console.warn("Erro ao solicitar permissão:", err);
      setHasPermission(true);
    }
  }

  // ===========================
  // 🎯 META QUEST → carregar direto
  // ===========================
  if (isQuest) {
    console.log("🥽 Meta Quest detectado → carregando tour direto sem permissão.");
    return (
      <iframe
        src="/tour/index.html"
        style={{ width: "100vw", height: "100vh", border: "none" }}
        allow="xr-spatial-tracking; vr; fullscreen"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-pointer-lock"
      />
    );
  }

  // ===========================
  // 🖥 DESKTOP → carregar direto
  // ===========================
  if (!isMobileDevice) {
    return (
      <iframe
        src="/tour/index.html"
        style={{ width: "100vw", height: "100vh", border: "none" }}
        allow="fullscreen"
        allowFullScreen
        sandbox="allow-same-origin allow-scripts allow-pointer-lock"
      />
    );
  }

  // ===========================
  // 📱 MOBILE → precisa de permissão
  // ===========================
  if (!hasPermission) {
    return (
      <div
        onClick={handleEnable}
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.4rem" }}>Toque para ativar o modo 360°</p>
        <p style={{ opacity: 0.6, fontSize: "1rem" }}>
          Será solicitado acesso ao giroscópio.
        </p>
      </div>
    );
  }

  // ===========================
  // 📱 MOBILE COM PERMISSÃO → carregar tour
  // ===========================
  return (
    <iframe
      src="../tour/index.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      allow="gyroscope; accelerometer; magnetometer; fullscreen"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-pointer-lock"
    />
  );
}
