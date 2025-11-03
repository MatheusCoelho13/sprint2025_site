import React from "react"
import { ArrowRight,  Sparkles, } from "lucide-react";
import { motion } from "framer-motion";
import Buttons from "../components/Button";
const Sections1: React.FC = () => {


return(
<section className="py-20 pt-18 px-6 bg-gradient-to-t from-[#0a3d5a]/50 to-transparent">
          <div className=" pt-18 container mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-[#eff5f5]">
                Sua Próxima Aventura Começa Aqui
              </h2>
              
              <p className="text-xl text-[#a7b1b9] max-w-2xl mx-auto">
                Entre em um mundo onde a imaginação não tem limites e cada experiência é única
              </p>

              
              
            </motion.div>
          </div>
        </section>
)
}
export default Sections1;