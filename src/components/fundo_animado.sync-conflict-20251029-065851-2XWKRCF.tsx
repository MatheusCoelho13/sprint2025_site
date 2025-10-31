import { motion } from 'framer-motion';
import {  type Variants } from 'framer-motion';

import React from 'react';
import MatrixCodeCanvas from './modules/Matrix_Content';
import { colors } from '../styles/colors';
// Tipagem para as propriedades
interface AnimatedMatrixBackgroundProps {
  // A classe para o container, garantindo que ele cubra a tela e seja o fundo
  className?: string;
}

// 1. Animação de loop para o container, dando uma pulsação sutil (15% de intensidade)
const pulseVariants: Variants = {
  animate: {
    // Altera a opacidade para simular um "flicker" ou pulsação de energia
    opacity: [0.78, 0.82, 0.65],
    // Simula um zoom ou pulsação lenta da imagem de fundo (1.00 a 1.01)
    scale: [1.00, 1.01, 1.00], 
    transition: {
      duration: 25, // Movimento muito lento e contínuo
      ease: "linear",
      repeat: Infinity,
      repeatType: 'loop', 
    },
  },
};

const AnimatedMatrixBackground: React.FC<AnimatedMatrixBackgroundProps> = ({ className = '' }) => {
  return (
    // O container principal, que define a cor escura e a posição absoluta
    <div className={`absolute inset-0 overflow-hidden bg-gray-900 ${className}`}>
      
      {/* Camada de cor escura sobreposta para garantir que o texto seja legível */}
      <div className="absolute inset-0 "  style={{backgroundColor:colors.bg}}/>

      {/* Camada que irá hospedar o efeito Matrix/Binário (onde o Canvas entraria) */}
      <motion.div
        variants={pulseVariants}
        initial="animate" // Inicia a animação imediatamente
        animate="animate"
        className="absolute inset-0"
        style={{
          // Este é o estilo visual que simula o fundo da sua imagem (profundidade, perspectiva e cor)
          background: 'radial-gradient(ellipse at center, #0c64975d,#1a5a7e,#3b7d46 )',
          // O brilho sutil na cor ciano para o efeito tech (como na imagem)
          boxShadow: 'inset 0 0 150px rgba(34, 211, 238, 0.05)', 
        }}
          >
          <MatrixCodeCanvas /> 
              
        {/*
          NOTA: O EFEITO MATRIX/BINÁRIO DE QUEDA (os números 0 e 1 caindo)
          NÃO PODE SER FEITO APENAS COM CSS.
          
          Aqui, você colocaria o componente que renderiza o Canvas com o código Matrix:
          
          Ele ficaria por cima do fundo gradiente e a animação do Framer Motion daria o efeito de pulsação e vida.
        */}
        
        {/* placeholder simples para simular as linhas de dados do fundo */}
         <div className="absolute inset-0" style={{ 
             backgroundImage: 'repeating-linear-gradient(0deg, rgba(34, 211, 238, 0.38) 0, transparent 1px, transparent 50px)',
             opacity: 0.0,
         }}></div>
      </motion.div>
    </div>
  );
};

export default AnimatedMatrixBackground;