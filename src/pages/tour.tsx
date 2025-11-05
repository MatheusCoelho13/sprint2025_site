import React from "react";
import { injectSpeedInsights } from "@vercel/speed-insights";

injectSpeedInsights();

export default function Tour() {
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
