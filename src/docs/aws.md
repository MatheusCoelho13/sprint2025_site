# 🕹️ Guia Completo: Ativar Giroscópio e Modo VR no Meta Quest com Marzipano

Este guia ensina como corrigir o problema do **giroscópio não funcionar** no Meta Quest (Oculus Browser / Wolvic), mesmo quando o tour 360° aparece corretamente. Ele também garante compatibilidade com **celulares Android, iPhone e navegadores desktop**.

---

## 🔊 Sintomas do Problema

* O tour aparece, mas **não responde ao movimento da cabeça**.
* O navegador exibe **três pontinhos no topo** e parece um **vídeo 360° estático**.
* Nenhum erro no console, mas o sensor não dispara eventos `DeviceOrientationEvent`.

---

## 🔧 Causa Raiz

O navegador **bloqueia os sensores de movimento (giroscópio, acelerômetro, magnetômetro)** quando:

1. O site **não está em HTTPS**.
2. O servidor **não define os cabeçalhos Permissions-Policy**.
3. O tour está dentro de um **iframe sem permissões**.
4. O usuário **não entrou no modo VR (WebXR)** do navegador.

---

## 🔒 Solução Completa

### **1. Ative HTTPS no servidor**

Se usar AWS, Vercel ou DuckDNS:

```bash
sudo certbot --nginx -d seu_dominio.duckdns.org
```

Depois verifique:

```bash
curl -v https://seu_dominio.duckdns.org
```

> O certificado deve ser válido para que o giroscópio funcione no Quest.

---

### **2. Adicione os cabeçalhos no Nginx**

Edite o arquivo de configuração do seu site:

```nginx
add_header Permissions-Policy "accelerometer=(self), gyroscope=(self), magnetometer=(self), vr=(self), fullscreen=(self)" always;
add_header Cross-Origin-Opener-Policy same-origin;
add_header Cross-Origin-Embedder-Policy require-corp;
```

Recarregue:

```bash
sudo systemctl reload nginx
```

Esses cabeçalhos dizem ao Quest para **liberar sensores e VR no seu domínio**.

---

### **3. Atualize o `<head>` do `index.html` do tour**

```html
<meta http-equiv="Permissions-Policy" content="accelerometer=(self), gyroscope=(self), magnetometer=(self), vr=(self), fullscreen=(self)">
<meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin">
<meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp">
```

---

### **4. Corrija o `iframe` do React (Tour.tsx)**

```tsx
<iframe
  src="/tour/index.html"
  style={{ width: "100vw", height: "100vh", border: "none" }}
  allow="xr-spatial-tracking; vr; gyroscope; accelerometer; magnetometer; fullscreen"
  allowFullScreen
/>
```

> O atributo `allow` é essencial para liberar sensores dentro do iframe.

---

### **5. Use o `index.js` corrigido**

O Marzipano precisa registrar o controle do giroscópio manualmente:

```js
var deviceOrientationControl = null;
if (typeof Marzipano.DeviceOrientationControlMethod === 'function') {
  deviceOrientationControl = new Marzipano.DeviceOrientationControlMethod();
}

async function enableGyroscope() {
  if (!deviceOrientationControl) return;
  try {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        controls.registerMethod('device', deviceOrientationControl);
        controls.enableMethod('device');
      }
    } else {
      controls.registerMethod('device', deviceOrientationControl);
      controls.enableMethod('device');
    }
  } catch (err) {
    console.error('Erro ao ativar giroscópio:', err);
  }
}

window.addEventListener('load', () => {
  const isVR = /OculusBrowser|Meta Quest/i.test(navigator.userAgent);
  if (isVR) {
    const btn = document.createElement('button');
    btn.textContent = '🥽 Ativar Giroscópio';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999,
      background: '#0a3d5a', color: '#fff', border: 'none',
      padding: '10px 16px', borderRadius: '10px', fontSize: '14px'
    });
    btn.onclick = () => { enableGyroscope(); btn.remove(); };
    document.body.appendChild(btn);
  } else {
    enableGyroscope();
  }
});
```

---

### **6. Ative o modo VR manualmente no Quest**

1. Abra o tour no navegador do Meta Quest.
2. Clique nos **três pontinhos** no canto superior direito.
3. Selecione **“Enter VR”** ou **“Entrar em VR”**.

> Isso inicializa o contexto WebXR. Sem isso, o giroscópio fica bloqueado e o tour aparece como um vídeo fixo.

---

## 🔄 Diagnóstico no console

Abra o console no Quest (ou Android conectado via ADB) e execute:

```js
DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission
```

* Se retornar **`undefined`** → O Quest ignora a permissão, apenas o modo VR funciona.
* Se retornar **`function`** → O navegador exige interação do usuário (toque ou clique).

---

## 🎯 Resumo Rápido

| Situação                         | Causa                              | Solução                   |
| -------------------------------- | ---------------------------------- | ------------------------- |
| Giroscópio não responde          | Quest fora do modo VR              | Ativar "Enter VR"         |
| Tour parece vídeo                | iframe sem `allow` correto         | Corrigir atributo `allow` |
| Não pede permissão               | HTTPS ausente / cabeçalho faltando | Ativar SSL e Headers      |
| Funciona no PC, mas não no Quest | Falta de WebXR ativo               | Entrar no modo VR         |

---

## ✅ Resultado Esperado

Com todas as correções aplicadas:

* O tour 360° abre normalmente em desktop e celular.
* No Meta Quest, ao clicar em **“Enter VR”**, o giroscópio responde ao movimento da cabeça.
* Não aparece mais o modo "vídeo 360°".

---

> Criado por **Matheus Coelho** — otimizado para **Marzipano + React + Meta Quest**.
