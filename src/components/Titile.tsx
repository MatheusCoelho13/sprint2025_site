// logica -> e um titulo muito destacado e que gere dopaminia e que atraia  o publico 
// refatorar -> deixar o codigo mais legivel
import React from 'react';

const Title: React.FC = () => {
    return (
        <div className="relative inline-block">
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#e8b443] via-[#3b7d46] to-[#1a5a7e] mb-6 animate-pulse">
                BIOTIC
            </h1>
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-[#e8b443]/30 via-[#3b7d46]/30 to-[#1a5a7e]/30 -z-10" />
        </div>
    );
};

export default Title;
              