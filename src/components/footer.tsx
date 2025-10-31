import React from "react";
import { Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-[#1a5a7e]/30 bg-[#0f172a]/60 backdrop-blur-md relative">
      <div className="container mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
        {/* Logo */}
          
      </div>
        <p className="text-[#a7b1b9] text-sm max-w-md mx-auto leading-relaxed">
          © 2025 Biotic. Todos os direitos reservados.  
          Feito com <span className="text-[#e8b443]">❤️</span> para exploradores de novas realidades.
        </p>
      </div>
    </footer>
  );
};
