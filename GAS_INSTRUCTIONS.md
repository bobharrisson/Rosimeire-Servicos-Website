
# Configuração do SIR Backend v2.2 (Motor Nativo Gmail)

Esta versão foca na simplicidade e confiabilidade, utilizando a sua conta Google autorizada para enviar as mensagens, sem depender de servidores externos.

## 1. O Código SIR v2.2 (Limpo)
Substitua todo o conteúdo do seu Apps Script por este:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v2.2
 * Bridge de Dados + GmailApp Native Mailer
 */

// FUNÇÃO DE ATIVAÇÃO: Execute uma vez após colar para dar permissão ao Gmail.
function MANUAL_AUTH_AND_TEST() {
  const userEmail = Session.getActiveUser().getEmail();
  try {
    GmailApp.sendEmail(userEmail, "Motor de E-mail SIR v2.2 Ativo", "O seu website agora utiliza o motor nativo do Google para contactos.");
    return "SUCESSO: E-mail de teste enviado para " + userEmail;
  } catch(e) {
    return "ERRO: " + e.toString();
  }
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (!sheet) return ContentService.createTextOutput("Erro: Aba 'Database' não encontrada").setMimeType(ContentService.MimeType.TEXT);
  const values = sheet.getRange(2, 1, 1, 13).getValues()[0]; 
  return ContentService.createTextOutput(JSON.stringify({
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
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput("JSON Erro").setMimeType(ContentService.MimeType.TEXT);
  }

  // AÇÃO: Envio de Contacto
  if (payload.action === 'send_contact') {
    try {
      const form = payload.formData || {};
      const recipient = payload.recipient || "atendimento@rosimeireservicos.com";
      
      const subject = "Website Rosimeire: Contacto de " + (form.name || "Cliente");
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; border: 2px solid #f8c8c4; padding: 30px; border-radius: 4px; color: #081221;">
          <h2 style="margin-top:0; border-bottom: 1px solid #f8c8c4; padding-bottom: 10px;">Novo Contacto Website</h2>
          <p><strong>Nome:</strong> ${form.name}</p>
          <p><strong>E-mail:</strong> ${form.email}</p>
          <p><strong>Contacto:</strong> ${form.phone}</p>
          <div style="background: #fdf2f2; padding: 20px; border-left: 5px solid #f8c8c4; margin: 20px 0;">
            <strong>Mensagem:</strong><br>${(form.message || "").replace(/\n/g, '<br>')}
          </div>
          <p style="font-size: 10px; color: #999;">Enviado via Website - Rosimeire Serviços</p>
        </div>
      `;
      
      GmailApp.sendEmail(recipient, subject, "", { 
        htmlBody: htmlBody, 
        replyTo: form.email,
        name: "Website Rosimeire"
      });
      
      logToSheet("Enviado", recipient);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      logToSheet("Erro", err.toString());
      return ContentService.createTextOutput(JSON.stringify({ status: "error" })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // AÇÃO: Salvar Dados
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (payload && sheet && payload.slides) {
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
    return ContentService.createTextOutput("Saved").setMimeType(ContentService.MimeType.TEXT);
  }
}

function logToSheet(status, info) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let log = ss.getSheetByName("Logs");
    if (!log) { log = ss.insertSheet("Logs"); log.appendRow(["Hora", "Status", "Info"]); }
    log.appendRow([new Date(), status, info]);
  } catch(e) {}
}
```

## 2. Passo Final de Ativação
1.  Cole o código e salve.
2.  Selecione `MANUAL_AUTH_AND_TEST` no topo e clique em **Executar**.
3.  Aceite as permissões.
4.  **Implantar** -> **Gerenciar Implantações** -> **Editar (lápis)** -> Versão: **Nova Versão** -> **Implantar**.
5.  No site (Painel Admin), verifique se o **E-mail de Recebimento** está preenchido e clique em **Guardar & Finalizar**.

Agora o sistema é 100% Google-to-Google, sem intermediários.
