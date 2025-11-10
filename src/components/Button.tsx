
import React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Link} from "lucide-react";
import { motion } from "framer-motion";


const Buttons: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    return (
       <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.7,
          type: 'spring',
          stiffness: 80
        }}
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
                >
      
        
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#e8b443] to-[#3b7d46] hover:from-[#3b7d46]/90 hover:to-[#e9b423]/90 text-[#0a3d5a] font-bold text-lg px-8 py-6 rounded-2xl shadow-2xl shadow-[#e8b443]/40 transform hover:scale-105 transition-all duration-300 group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <Play className="w-6 h-6 mr-2 group-hover:animate-bounce" />
                  Iniciar Tour Virtual
                  <ArrowRight className={`w-6 h-6 ml-2 transition-transform ${isHovered ? 'translate-x-2' : ''}`} />
                </Button>
               
                </motion.div>
    );
};

export default Buttons
              