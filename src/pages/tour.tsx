 
import React from "react";
import { injectSpeedInsights } from '@vercel/speed-insights';

   injectSpeedInsights();
export default function Tour() {
    return (
        <iframe
            src="../../public/tour/index.html"
            style={{
        width: "100vw",
        height: "100vh",
        border: "none",
      }}

        />
    );
}