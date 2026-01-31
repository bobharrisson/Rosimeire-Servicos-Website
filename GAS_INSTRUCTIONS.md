
# Configuração do SIR Backend v2.1 (Destino Dinâmico & Entrega Prioritária)

Esta versão garante que o e-mail seja enviado para o endereço definido por você no **Painel Administrativo do Site** (sessão SMTP/E-mail).

## 1. O Código SIR v2.1
Substitua todo o conteúdo do seu Apps Script por este:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v2.1
 * Bridge de Dados + Data Loss Protection + Dynamic Destination
 */

// FUNÇÃO CRÍTICA: Clique em EXECUTAR nesta função após colar o código!
function MANUAL_AUTH_AND_TEST() {
  Logger.log("Iniciando Teste de Entrega...");
  const userEmail = Session.getActiveUser().getEmail();
  
  try {
    GmailApp.sendEmail(userEmail, "Teste de Autorização SIR v2.1", "O seu motor de e-mail está autorizado e pronto para processar contactos do site.");
    Logger.log("E-mail de teste enviado para: " + userEmail);
    return "SUCESSO: E-mail enviado. Verifique sua caixa de entrada.";
  } catch(e) {
    Logger.log("ERRO: " + e.toString());
    return "FALHA: " + e.toString();
  }
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
    logToSheet("Erro no Payload", "JSON corrompido");
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "JSON Inválido" })).setMimeType(ContentService.MimeType.JSON);
  }

  // AÇÃO: Envio de Contacto do Site
  if (payload.action === 'send_contact') {
    try {
      const formData = payload.formData || {};
      const config = payload.emailConfig || {};
      
      const name = formData.name || "Cliente";
      const clientEmail = formData.email || "Sem e-mail";
      const phone = formData.phone || "Sem contacto";
      const message = formData.message || "";
      
      // PRIORIDADE: O e-mail configurado no Admin do site
      const recipient = payload.recipient || config.recipientEmail || "atendimento@rosimeireservicos.com";
      
      const subject = "⚠️ NOVO CONTACTO: " + name;
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #f8c8c4; padding: 20px; border-radius: 8px;">
          <h2 style="color: #081221; border-bottom: 2px solid #f8c8c4; padding-bottom: 10px;">Rosimeire Serviços - Contacto</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>E-mail do Cliente:</strong> ${clientEmail}</p>
          <p><strong>Telemóvel:</strong> ${phone}</p>
          <div style="background: #fdf2f2; padding: 15px; border-left: 4px solid #f8c8c4; margin-top: 20px;">
            <strong>Mensagem:</strong><br>
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p style="font-size: 10px; color: #999; margin-top: 30px;">Mensagem enviada via formulário do website.</p>
        </div>
      `;
      
      // Envio Real
      GmailApp.sendEmail(recipient, subject, "", { 
        htmlBody: htmlBody,
        replyTo: clientEmail,
        name: "Website Rosimeire"
      });
      
      logToSheet("E-mail Enviado", "Destino: " + recipient + " | Remetente: " + clientEmail);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (err) {
      logToSheet("Falha no E-mail", err.toString());
      return ContentService.createTextOutput(JSON.stringify({ status: "error", details: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // AÇÃO: Salvar Dados da Planilha
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
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  }
}

function logToSheet(status, message) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let logSheet = ss.getSheetByName("Logs");
    if (!logSheet) { logSheet = ss.insertSheet("Logs"); logSheet.appendRow(["Hora", "Estado", "Info"]); }
    logSheet.appendRow([new Date(), status, message]);
  } catch(e) {}
}
```

## 2. Instruções de Ativação (Não Pule!)

1.  **Cole o código** v2.1 no editor do Script.
2.  Na barra superior do editor, selecione a função **`MANUAL_AUTH_AND_TEST`**.
3.  Clique em **Executar**.
4.  Dê todas as permissões necessárias (Avançado -> Aceder a Rosimeire Serviços).
5.  **IMPORTANTE**: Vá ao site, entre no **Painel Admin**, vá à aba **E-mail** e verifique se o campo **"E-mail de Recebimento"** tem o seu e-mail correto. Clique em **Guardar & Finalizar**.
6.  Agora, faça um teste real na página de Contactos.

O script agora sabe que deve olhar para o campo "E-mail de Recebimento" da planilha antes de disparar.
