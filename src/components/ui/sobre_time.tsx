import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Linkedin, Mail, Pi } from "lucide-react";
//  fotos do time
import Matheus from "../../assets/matheusc.jpg";
import Max from "../../assets/max.jpg";
import Pietro from "../../assets/pietro.jpg";
import Moises from "../../assets/moises.jpg";






export const SobreTime: React.FC = () => {
  const team = [
    {
      name: "Matheus Coelho Fernandes",
      role: "Desenvolvedor full-stack",
      image: Matheus,
      bio: "Responsável pelo desenvolvimento completo do site, Foco em criação de experiências imersivas e de usuário.",
      linkedin: "https://linkedin.com/in/matheuscoelhofernandes", 
      email: "25101502@idp.aluno.edu.br", 
    },
    {
      name: "Miguel Maximus",
      role: "",
      image: Max,
      bio: "Diretor de arte",
      linkedin: "https://www.linkedin.com/in/miguel-maximus-rodrigues-oliveira-4a17a531a/",
      email: "#",
    },
    {
      name: "Pietro Branco Rossi",
      role: "Diretora de Design",
      image: Pietro,
      bio: "Gerente de projeto",
      linkedin: "https://www.linkedin.com/in/pietro-branco-rossi/",
      email: "24201030@idp.aluno.edu.br",
    },
    {
      name: "Moises Silva de Sousa",
      role: "Monitor da equipe do Sprint  ",
      image: Moises,
      bio: "Especialista em gamificação",
      linkedin: "https://www.linkedin.com/in/moises-sousa-a582b4164/",
      email: "moises.sousa@idp.edu.br",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0a3d5a]/30 to-transparent">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#eff5f5] mb-4">
            Conheça Nosso Time
          </h2>
          <p className="text-xl text-[#a7b1b9] max-w-2xl mx-auto">
            Especialistas apaixonados por criar experiências inesquecíveis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="relative bg-gradient-to-br from-[#0a3d5a]/40 to-[#1a5a7e]/20 backdrop-blur-lg border-2 border-[#1a5a7e]/50 p-6 h-full overflow-hidden group hover:border-[#e8b443]/50 transition-all duration-300">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#e8b443]/50 group-hover:border-[#e8b443] transition-all duration-300"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#eff5f5] mb-1">
                      {member.name}
                    </h3>
                    <p className="text-[#e8b443] text-sm font-semibold mb-2">
                      {member.role}
                    </p>
                    <p className="text-[#a7b1b9] text-sm">{member.bio}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(member.linkedin, "_blank")}
                      className="h-8 w-8 border-[#1a5a7e] text-[#e8b443] hover:bg-[#1a5a7e]/20 hover:border-[#e8b443]"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                     <Button
                      variant="outline"
                      size="icon"
                      onClick={() => (window.location.href = `mailto:${member.email}`)}
                      className="h-8 w-8 border-[#1a5a7e] text-[#e8b443] hover:bg-[#1a5a7e]/20 hover:border-[#e8b443]"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                      
                    
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
