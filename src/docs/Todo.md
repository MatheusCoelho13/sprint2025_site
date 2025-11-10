# ✅ TODO LIST — Projeto Biotic

> **"Viaje por realidades impossíveis e descubra mundos que só existem na sua imaginação."**  
> Um tour virtual que transforma curiosidade em aventura épica.

---

## 🎨 Design & Interface

### 🎯 Hero Section (Tela inicial)
- [x] Logotipo **"BIOTIC"** com gradiente suave (amarelo → verde → azul)
- [x] Fundo animado estilo **Matrix** (números binários)

- [x] Ajustar contraste do texto principal (`#e8ecf1` em vez de branco puro)
- [ ] Inserir **sombra suave** no logo para maior destaque
- [x] Animação de entrada do título com **Framer Motion**
- [ ] Suavizar espaçamento e line-height do subtítulo principal

### 🖱️ Botões e interações
- [x] Botão principal “Iniciar Tour Virtual”
- [x] Adicionar **hover animado** (leve `scale(1.05)` + sombra)
- [x] Criar **transição suave (scroll ou route)** ao clicar no botão
- [ ] Inserir **efeito de brilho** ou **gradiente animado** no hover
- [ ] Revisar contraste do botão em telas OLED

---

## ⚙️ Funcionalidades
## 👨‍💻 Ideias de implementaçao
- [ ] Adicionar leve **efeito de parallax ou giroscópio** no fundo
### 🌐 Tour Virtual
- [x] Integração do botão com rota `/tour`
- [ ] Ajustar comportamento em **Meta Quest Browser** (VR automático)
- [x] Confirmar ativação do **sensor giroscópio**
- [ ] colocar **tela de loading** quando  abiri o tour (somente destok e celular) 
- [ ] Implementar fallback para desktop (navegação via mouse)

---

### 🔧 Performance e compatibilidade

- [ ] Testar desempenho no **Vercel** e **AWS EC2**
- [ ] Adicionar **lazy loading** nas seções abaixo do fold
- [x] Ajustar **viewport meta tags** para compatibilidade VR
- [ ] Testar funcionamento no navegador padrão do Meta Quest
- [ ] Adicionar **detecção automática de dispositivo** (VR / mobile / PC)
---

## 🧭 Conteúdo e Navegação

- [x] Texto principal revisado (“Viaje por realidades impossíveis...”)
- [ ] Adicionar subtítulo secundário com frase de impacto
- [ ] Inserir seção “Explore o futuro da tecnologia” com animação
- [ ] Criar botão secundário “Saiba mais”
- [ ] Revisar rotas com `ForceTrailingSlash()` no React Router

---

## 🧩 Código e Estrutura

- [x] Componente `AnimatedTechBackground`
- [x] Componente `Title`, `SubTitle` e `Button`
- [ ] Compatibilide a giroscopio tambem na homepage
- [ ] Revisar `index.css` e remover redundâncias
- [ ] Adicionar comentários de documentação nos principais componentes
- [ ] Atualizar README com instruções de build e deploy
- [ ] Adicionar **modo noturno e claro** automático
---

## 🧠 Melhorias Futuras


- [ ] Implementar **tradução EN/PT** com i18next
- [ ] Criar página “Sobre o Biotic” com créditos e equipe
- [ ] Adicionar **analytics** de visualizações do tour
- [ ] Integração com **API de hotspots dinâmicos** (banco de dados)

---
## testes

-[ ]  teste do giroscopio no meta quest
- [ ] testar conecçao por  sem fio
- [ ] 
 
 ## o que precisa baixar 
 -[ ] android studio 
 -[ ] platafrom tool
 -[ ] meta quest link

### 📅 Última atualização
**Data:** `09/11/25`  
**Responsável:** `Matheus Coelho`

---
