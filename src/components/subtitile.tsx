// logica -> e um subtitulo muito destacado e que gere dopaminia e que atraia  o publico 
// refatorar -> deixar o codigo mais legivel
import React from 'react';
import { motion } from "framer-motion";
const SubTitle: React.FC = () => {
    return (
       <motion.p 
                className="text-2xl md:text-3xl text-[#eff5f5] max-w-3xl mx-auto font-light leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Viaje por realidades impossíveis e descubra mundos que só existem na sua imaginação
              </motion.p>
    );
};

export default SubTitle;
              