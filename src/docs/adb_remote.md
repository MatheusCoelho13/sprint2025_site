# 📡 Conectando o Meta Quest ao PC via ADB Remotamente

Este guia mostra como conectar o **Meta Quest** ao seu **PC via ADB (Android Debug Bridge)** usando a rede Wi-Fi — sem precisar de cabo USB após a configuração inicial.

---

## 🧠 1️⃣ Pré-requisitos
- O **modo desenvolvedor** deve estar ativado no Quest.
  - No aplicativo **Meta (no celular)** → *Dispositivos → Seu headset → Modo Desenvolvedor → Ativar*.
- O **ADB** deve estar instalado no PC.
- O **PC e o Quest** precisam estar na **mesma rede Wi-Fi**.

---

## 🔌 2️⃣ Conexão inicial via cabo USB
Conecte o Meta Quest ao seu PC com o cabo USB e, no terminal, digite:

```bash
adb devices
```

No visor do Quest, **aceite a permissão de depuração USB**.

---

## 🌐 3️⃣ Ativar modo TCP/IP no Questa
Ainda com o cabo conectado, rode o comando abaixo para habilitar o modo de rede na porta 5555:

```bash
adb tcpip 5555
```

Saída esperada:
```
restarting in TCP mode port: 5555
```

---

## 🔍 4️⃣ Descobrir o IP do Quest
Há duas formas de ver o IP:

- No headset: **Configurações → Wi-Fi → Detalhes da rede → Endereço IP**
- Ou, via cabo:
  ```bash
  adb shell ip addr show wlan0
  ```

📍 *Exemplo:* `192.168.35.91`

---

## 🔗 5️⃣ Conectar remotamente
Desconecte o cabo USB e conecte-se pela rede Wi-Fi usando o IP do Quest:

```bash
adb connect 192.168.35.1:5555
```

Saída esperada:
```
connected to 192.168.35.91:5555
```

---

## ✅ 6️⃣ Confirmar a conexão
Verifique se o dispositivo aparece na lista:

```bash
adb devices
```

Saída esperada:
```
List of devices attached
192.168.35.91:5555   device
```

Se aparecer `device`, está tudo certo! 🎯

---

## 🧹 7️⃣ Desconectar (opcional)
Quando quiser encerrar a sessão remota:

```bash
adb disconnect 192.168.35.91:5555
```

---

## ⚠️ Solução de Problemas
- **Connection refused:** verifique se o Quest e o PC estão na mesma rede Wi-Fi.
- **IP mudou:** o IP do Quest pode mudar após reiniciar — verifique novamente em *Configurações → Wi-Fi*.
- **Firewall bloqueando:** verifique se a porta 5555 está liberada no firewall do PC.

---

## 🧭 Exemplo prático (seu caso)
| Dispositivo | IP | Status |
|--------------|------------|---------|
| Meta Quest | `192.168.35.91` | ✅ ativo |
| PC | `192.168.35.171` | ✅ mesma rede |

Com isso, o comando correto é:

```bash
adb connect 192.168.35.91:5555
```

Pronto! O ADB estará conectado via Wi-Fi e você poderá usar comandos como `adb install`, `adb logcat`, `adb shell`, etc., diretamente no Meta Quest sem cabo. 🕶️⚡

