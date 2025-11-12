import { motion } from "framer-motion";

import Logo from "../assets/Logo.png";

export function Menu() {
    return (
        <>
         <div className="relative z-20 w-full">
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a3d5a]/20 border-b border-[#1a5a7e]/30
          h-21">
            <div className="container mx-auto px-6 py-4 flex justify-between">
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                
                  <img
                    src={Logo}
                    alt="Logo"
                    className=" relative right-0 bottom-2"
                    width={90}
                    height={90} />
                  
         
              </motion.div>
            </div>
          </header>
         </div>
        </>
    )
}