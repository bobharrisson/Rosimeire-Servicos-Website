
# Configuração do SIR Backend v2.0 (Sistema de Depuração & Entrega Garantida)

Se os e-mails não estão chegando, esta versão ajudará a identificar o erro criando um registro histórico na sua própria planilha.

## 1. O Código Definitivo (v2.0)
Substitua todo o conteúdo do seu script por este código:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v2.0
 * Bridge de Dados + Data Loss Protection + Error Logging System
 */

// Função para autorizar e testar o script manualmente no editor (Clique em EXECUTAR nesta função primeiro)
function MANUAL_AUTH_AND_TEST() {
  Logger.log("Script Autorizado com Sucesso!");
  const email = Session.getActiveUser().getEmail();
  GmailApp.sendEmail(email, "Teste de Autorização SIR", "Se recebeu este e-mail, o script está autorizado a enviar mensagens.");
  return "OK";
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (!sheet) return ContentService.createTextOutput("Erro: Aba 'Database' não encontrada").setMimeType(ContentService.MimeType.TEXT);
  
  const values = sheet.getRange(2, 1, 1, 13).getValues()[0]; 
  const data = {
    slides: JSON.parse(values[0] || "[]"),
    siteConfig: JSON.parse(values[1] || "{}"),
    sectionImages: JSON.parse(values[2] || "{}"),
    socialLinks: JSON.parse(values[3] || "{}"),
    emailConfig: JSON.parse(values[4] || "{}"),
    notices: JSON.parse(values[5] || "[]"),
    reviews: JSON.parse(values[6] || "[]"),
    partners: JSON.parse(values[7] || "[]"),
    googleMapsLink: values[8] || "",
    contactPhone: values[9] || "",
    addressDetail: values[10] || "",
    adminUsername: values[11] || "admin",
    adminPassword: values[12] || "rosimeire2025"
  };
  
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    logToSheet("Erro Crítico", "JSON Inválido recebido: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "JSON Inválido" })).setMimeType(ContentService.MimeType.JSON);
  }

  // AÇÃO: Envio de Contacto
  if (payload.action === 'send_contact') {
    try {
      const formData = payload.formData || {};
      const config = payload.emailConfig || {};
      
      const name = formData.name || "N/A";
      const clientEmail = formData.email || "N/A";
      const phone = formData.phone || "N/A";
      const message = formData.message || "Sem conteúdo";
      const recipient = config.recipientEmail || "atendimento@rosimeireservicos.com";
      
      const subject = "Website Rosimeire: Contacto de " + name;
      const htmlBody = `
        <div style="font-family: sans-serif; border: 1px solid #f8c8c4; padding: 20px;">
          <h2>Novo Contacto</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${clientEmail}</p>
          <p><strong>Telefone:</strong> ${phone}</p>
          <hr>
          <p><strong>Mensagem:</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `;
      
      // Tentativa de envio via Gmail Relay
      GmailApp.sendEmail(recipient, subject, "", { 
        htmlBody: htmlBody,
        replyTo: clientEmail,
        name: "Website Rosimeire"
      });
      
      logToSheet("Sucesso", "E-mail enviado para " + recipient);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (err) {
      logToSheet("Erro no Envio", err.toString());
      return ContentService.createTextOutput(JSON.stringify({ status: "error", details: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // AÇÃO PADRÃO: Salvar Dados
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const hasValidSlides = payload.slides && payload.slides.length > 0;
  if (payload && sheet && hasValidSlides) {
    const row = [
      JSON.stringify(payload.slides),
      JSON.stringify(payload.siteConfig),
      JSON.stringify(payload.sectionImages || {}),
      JSON.stringify(payload.socialLinks || {}),
      JSON.stringify(payload.emailConfig || {}),
      JSON.stringify(payload.notices || []),
      JSON.stringify(payload.reviews || []),
      JSON.stringify(payload.partners || []),
      payload.googleMapsLink || "",
      payload.contactPhone || "",
      payload.addressDetail || "",
      payload.adminUsername || "admin",
      payload.adminPassword || "rosimeire2025"
    ];
    sheet.getRange(2, 1, 1, 13).setValues([row]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "ignored" })).setMimeType(ContentService.MimeType.JSON);
}

// Função Auxiliar para Logs
function logToSheet(status, message) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let logSheet = ss.getSheetByName("Logs");
  if (!logSheet) {
    logSheet = ss.insertSheet("Logs");
    logSheet.appendRow(["Data/Hora", "Status", "Detalhes"]);
    logSheet.getRange(1,1,1,3).setFontWeight("bold").setBackground("#f3f3f3");
  }
  logSheet.appendRow([new Date(), status, message]);
}
```

## 2. Como Garantir que Funcione (Passo-a-Passo)

### A. Autorização (O mais importante)
1. No editor do Apps Script, olhe para a barra de ferramentas superior onde diz `doGet`.
2. Clique na seta ao lado e selecione a função **`MANUAL_AUTH_AND_TEST`**.
3. Clique no botão **Executar** (índice de play).
4. Uma janela pedirá permissão. Clique em **Revisar Permissões**, escolha sua conta, clique em **Avançado** e depois em **Aceder a Rosimeire Serviços (não seguro)**.
5. Aceite tudo. Se você receber um e-mail de teste agora, o backend está pronto.

### B. Implantação
1. Clique em **Implantar** > **Gerenciar Implantações**.
2. Clique no ícone de **Lápis** para editar.
3. No campo "Versão", selecione obrigatoriamente **"Nova Versão"**.
4. Clique em **Implantar**.

### C. Verificação de Erros
Se enviar pelo site e não chegar:
1. Abra a sua Planilha Google.
2. Procure a nova aba **"Logs"** que o script criou.
3. Lá dirá exatamente se o Google bloqueou o e-mail ou se o destinatário estava errado.

**Nota sobre SMTP:** Como o Google Script é executado nos servidores do Google, ele usa a API nativa do Gmail. As configurações de SMTP que você preencheu no Admin servem como registro e para definir o `recipientEmail` (para onde o e-mail vai). Se você precisar usar um servidor SMTP externo (como Outlook ou Hostgator) de forma rigorosa, seria necessário um backend em Node.js ou PHP. Este método via GAS é o mais seguro e gratuito para o seu volume de atendimento.
