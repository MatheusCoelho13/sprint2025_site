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
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Tour from "./pages/tour";
import React from "react";
import TextWriting from "./components/modules/Text_writting";
import { Menu } from "./components/menu";
/**
 * 🔁 Força uma barra final ("/") nas URLs — ex: "/tour" → "/tour/"
 */
function ForceTrailingSlash(): null {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isFile = /\.[a-zA-Z0-9]+$/.test(location.pathname);
    if (!location.pathname.endsWith("/") && !isFile) {
      navigate(location.pathname + "/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}

function Home() {
  const features: Feature[] = [
    {
      icon: Globe,
      title: "Conheça o Parque Tecnológico Biotic",
      description: "Explore a Biotic sem sair da sua casa",
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
      title: "Conheça o futuro da tecnologia do DF",
      description:
        "Entre no universo tecnológico que está transformando o Distrito Federal.",
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
          
         <Menu />
        

          {/* Conteúdo principal */}
          <div className="relative z-10 text-center text-white px-6 pt-28">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="pt-32" />
              <Title />
              <div className="pt-16" />
              <SubTitle />
              <div className="pt-10" />

              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Um tour virtual que transforma curiosidade em aventura épica
              </p>

              {/* Animação de texto com Typewriter */}
       <TextWriting  className="mt-6" />

              <Link
                to="/tour/"
                className="text-white hover:text-[#3b7d46] transition"
              >
                <Buttons />
              </Link>
            </motion.div>
          </div>

          {/* Cards */}
          <section className="py-20 px-6 bg-gradient-to-b from-transparent to-[#0a3d5a]/30">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
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
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <Cards {...feature} index={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Seção pré-final e footer */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
          >
            <Sections1 />
            <Footer />
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <ForceTrailingSlash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tour/" element={<Tour />} />
        <Route
          path="*"
          element={
            <h1 className="text-white text-center mt-20">
              404 - Página não encontrada
            </h1>
          }
        /> 
      </Routes>
    </>
  );
}
