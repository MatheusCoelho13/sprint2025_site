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
  const mobile = ('userAgentData' in navigator
    ? (navigator as any).userAgentData?.mobile
    : undefined) ?? /Mobi|Android/i.test(navigator.userAgent);
  // Tela inicial antes de ativar sensores
  if (!hasPermission) {
    // detect user agent: iOS, Android, Quest/Oculus/Pico, Wolvic or generic mobile
    const ua = navigator.userAgent || "";
    const isiOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isQuest = /Oculus|Quest|Meta Quest|PICO|Pico/i.test(ua) || /OculusBrowser/i.test(ua);
    const isWolvic = /Wolvic/i.test(ua);
    const isMobileOrVR = Boolean(mobile) || isiOS || isAndroid || isQuest || isWolvic;

    // If it's a desktop (não mobile/VR) skip the permission screen and load the tour directly
    if (!isMobileOrVR) {
      return (
        
        <iframe
          src="/tour/index.html"
          style={{ width: "100vw", height: "100vh", border: "none" }}
          allow="xr-spatial-tracking; vr; gyroscope; accelerometer; magnetometer; fullscreen"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-top-navigation-by-user-activation"
        />
      );
    }
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
