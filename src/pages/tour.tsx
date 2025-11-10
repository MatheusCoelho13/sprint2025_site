import React, { useState } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
  const [hasPermission, setHasPermission] = useState(false);

  async function handleEnable() {
    try {
      // Chrome Mobile / iOS / Android 13+
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === "granted") {
          setHasPermission(true);
        } else {
          alert("❌ Permissão negada. Vá em Configurações → Site → Movimento do sensor e ative.");
        }
      } else {
        // Meta Quest, Wolvic, navegadores VR não exigem permissão explícita
        setHasPermission(true);
      }
    } catch (err) {
      console.warn("Erro ao solicitar permissão:", err);
    }
  }

  // Tela inicial antes de ativar sensores
  if (!hasPermission) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#000",
          color: "#fff",
          textAlign: "center",
          fontFamily: "sans-serif",
          padding: "1rem",
        }}
        onClick={handleEnable}
      >
        <p style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>
          🥽 Toque para ativar o modo 360° / VR
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>
          O navegador solicitará acesso ao giroscópio e abrirá o tour.
        </p>
      </div>
    );
  }

  // Tour carregado após permissão
  return (
    <iframe
      src="/tour/index.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      // 🔹 Permissões completas para Quest e navegadores VR
      allow="xr-spatial-tracking; vr; gyroscope; accelerometer; magnetometer; fullscreen"
      allowFullScreen
      // 🔹 Sandbox seguro mas com scripts liberados
      sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-top-navigation-by-user-activation"
    />
  );
}
