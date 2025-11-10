import React, { useEffect, useRef, useState } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
  const [isVRDevice, setIsVRDevice] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    if (/OculusBrowser|Meta Quest|Android/i.test(userAgent)) {
      setIsVRDevice(true);
    }
  }, []);

  useEffect(() => {
    if (!isVRDevice) return;

    const handleClick = async () => {
      try {
        if (
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission === "function"
        ) {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === "granted") {
            setHasPermission(true);
          } else {
            alert("Permissão negada. Habilite o giroscópio nas configurações do navegador VR.");
          }
        } else {
          // Meta Quest / Chrome VR normalmente não precisa pedir
          setHasPermission(true);
        }
      } catch (err) {
        console.warn("Erro ao solicitar permissão do giroscópio:", err);
      } finally {
        document.removeEventListener("click", handleClick);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isVRDevice]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.setAttribute("webkitallowfullscreen", "true");
      iframeRef.current.setAttribute("mozallowfullscreen", "true");
    }
  }, []);

  // Tela inicial para VR
  if (isVRDevice && !hasPermission) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
          flexDirection: "column",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <p style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>👉 Toque na tela para ativar o modo VR</p>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          O navegador solicitará acesso ao giroscópio e abrirá automaticamente o tour 360°.
        </p>
      </div>
    );
  }

  // Quando a permissão for concedida, renderiza o iframe
  return (
    <iframe
      ref={iframeRef}
      src="/tour/index.html"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      allow="xr-spatial-tracking; vr; gyroscope; accelerometer; magnetometer; fullscreen"
      allowFullScreen
      sandbox="allow-same-origin allow-scripts allow-pointer-lock allow-forms allow-top-navigation-by-user-activation"
    />
  );
}
