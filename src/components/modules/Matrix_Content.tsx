import React, { useEffect, useRef } from 'react';

// Constantes e caracteres inspirados no filme Matrix
const FONT_SIZE = 18;
const CHARACTERS = '01'; // Foco no binário
 const colors = ['#0a3d5a', '#1a5a7e', '#3b7d46', '#174f28'];

const MatrixCanvas: React.FC = () => {
  // Tipagem forte: useRef é usado para referenciar o elemento Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Verificações de segurança obrigatórias em TS/JS
    if (!canvas) return; 

    // Obtém o contexto de renderização 2D
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Define o tamanho inicial do Canvas
    canvas.width = window.innerWidth;
    canvas.height = 600; 

    const columns = Math.floor(canvas.width / FONT_SIZE);
    // Array para rastrear a posição Y de cada coluna (tipado como number[])
    const drops: number[] = Array(columns).fill(0);

    const draw = () => {
      // 1. FUNDO: Cria o rastro com transparência
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. TEXTO: Configura cor e fonte
      ctx.fillStyle =" rgba(15, 23, 42, 0.05)";
      ctx.font = `${FONT_SIZE}px monospace`;

      // 3. Desenha e move cada gota na tela
      for (let i = 0; i < drops.length; i++) {
        const text = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        const Color = colors[Math.floor(Math.random()* colors.length)]
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;
        
        ctx.fillText(text, x, y);

      
        //3.1 logica de mudança de cor  fazendo ficar mudando a cor das letras

        ctx.fillStyle = Color


        // 4. Lógica de Reinício
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.98) {
          drops[i] = 0; 
        }

        // Move a próxima gota para baixo
        drops[i]++;
      }
    };

    // Usa setInterval para animar
    const intervalId = setInterval(draw, 60); 

    // Limpeza para evitar memory leaks
    return () => clearInterval(intervalId);
  }, []); // Dependências vazias = executa apenas na montagem

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full" 
    />
  );
};

export default MatrixCanvas;