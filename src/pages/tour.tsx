import React, { useEffect, useState } from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
  const [isVRDevice, setIsVRDevice] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    if (/OculusBrowser|Meta Quest|Android/i.test(userAgent)) {
      setIsVRDevice(true);
    }
  }, []);

  useEffect(() => {
    if (isVRDevice) {
      window.location.href = "/tour/index.html";
    }
  }, [isVRDevice]);

  if (isVRDevice) return null;

  return (
    <iframe
      src="/tour/index.html"
      style={{
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      allow="vr; gyroscope; accelerometer"
      allowFullScreen
    />
  );
}
