import { useEffect } from "react";

export default function Tour() {
  useEffect(() => {
    // Redirecionar para o tour REAL (fora do React)
    window.location.replace("/tour/index.html");
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.4rem",
      }}
    >
      Carregando Tour 360°...
    </div>
  );
}
