import "./index.css";
import { motion } from "framer-motion";
import AnimatedTechBackground from "./components/fundo_animado";
import Title from "./components/Titile";
import SubTitle from "./components/subtitile";
import Buttons from "./components/Button";
import { Cards, Feature } from "./components/cards";
import Sections1 from "./components/section-prefinal";
import { Footer } from "./components/footer";
import { Globe, Users, Zap } from "lucide-react";
import { Link, Route, Routes } from "react-router-dom";
import Tour from "./pages/tour";

function Home() {
  const features: Feature[] = [
    {
      icon: Globe,
      title: "Mundos Infinitos",
      description: "Explore universos virtuais sem limites",
      bgColor: "bg-gradient-to-br from-[#3b7d46]/20 to-[#174f28]/20",
      borderColor: "border-[#3b7d46]/50",
      iconBg: "from-[#3b7d46] to-[#174f28]",
      glowColor: "#3b7d46",
    },
    {
      icon: Users,
      title: "Aventura em Grupo",
      description: "Compartilhe experiências com amigos",
      bgColor: "bg-gradient-to-br from-[#e8b443]/20 to-[#e8b443]/10",
      borderColor: "border-[#e8b443]/50",
      iconBg: "from-[#e8b443] to-[#e8b443]",
      glowColor: "#e8b443",
    },
    {
      icon: Zap,
      title: "Ação Instantânea",
      description: "Mergulhe em segundos na aventura",
      bgColor: "bg-gradient-to-br from-[#1a5a7e]/20 to-[#0a3d5a]/20",
      borderColor: "border-[#1a5a7e]/50",
      iconBg: "from-[#1a5a7e] to-[#0a3d5a]",
      glowColor: "#1a5a7e",
    },
  ];

  return (
    <>
      <AnimatedTechBackground />

      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-20 w-full">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a3d5a]/20 border-b border-[#1a5a7e]/30">
            <div className="container mx-auto px-6 py-4 flex justify-between">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link to="/" className="text-white text-xl font-bold">
                  Biotic
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                
                 
              </motion.div>
            </div>
          </header>

          {/* Conteúdo principal */}
          <div className="relative z-10 text-center text-white px-6 pt-28">
           <div className="pt-32"></div>
            <Title />
            <div className="pt-4"></div>
            <SubTitle />
                  <div className="pt-4"></div>
                  {/*   Transformamos ideias complexas em soluções digitais inovadoras com
              design e performance */}
                  {/* */}
            <p className="text-lg mb-8 max-w-2xl mx-auto">
            Um tour virtual que transforma curiosidade em aventura épica 
            </p>
            <Link
                  to="/tour"
                  className="text-white hover:text-[#3b7d46] transition"
                >
            <Buttons />
            </Link>
          </div>

          {/* Cards */}
          <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a3d5a]/30">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-[#eff5f5] mb-4">
                  Por Que Biotic é Especial?
                </h2>
                <p className="text-xl text-[#a7b1b9] max-w-2xl mx-auto">
                  Tecnologia de ponta encontra diversão sem limites
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                  <Cards key={index} {...feature} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Seção pré-final */}
          <Sections1 />

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour" element={<Tour />} />
      <Route path="*" element={<h1 className="text-white text-center mt-20">404 - Página não encontrada</h1>} />
    </Routes>
  );
}
