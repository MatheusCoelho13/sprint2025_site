import React, { useState } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
  const [hasPermission, setHasPermission] = useState(false);

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
          alert("Permissão negada. Vá em Configurações → Site → Movimento do sensor e ative.");
        }
      } else {
        // Navegadores que não pedem permissão (Meta Quest, Wolvic)
        setHasPermission(true);
      }
    } catch (err) {
      console.warn("Erro ao solicitar permissão:", err);
    }
  }

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
        }}
        onClick={handleEnable}
      >
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          👉 Toque para ativar o giroscópio
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          O navegador solicitará acesso ao giroscópio e abrirá o tour 360°.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src="/tour/index.html"
      style={{ width: "100vw", height: "100vh", border: "none" }}
      allow="accelerometer; gyroscope; magnetometer; fullscreen"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-top-navigation-by-user-activation"
    />
  );
}
