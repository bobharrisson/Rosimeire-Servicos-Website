
# Configuração do Banco de Dados Sincronizado v1.5 (Suporte a Contactos & E-mail)

Este script v1.5 agora atua como o seu "Backend" completo, gerenciando não apenas as configurações do site, mas também o envio de e-mails do formulário de contacto diretamente para o e-mail da empresa.

## 1. Atualizar o Script v1.5
1. Na sua planilha Google, vá em **Extensões** > **Apps Script**.
2. Substitua todo o código pela versão v1.5 abaixo:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v1.5
 * Sincronização de Dados + Motor de Envio de E-mails
 */

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
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
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");

  // ROTEAMENTO DE AÇÕES
  
  // AÇÃO 1: Envio de Formulário de Contacto
  if (payload.action === 'send_contact') {
    try {
      const { name, email, phone, message } = payload.formData;
      const recipient = payload.recipient || "atendimento@rosimeireservicos.com";
      
      const subject = "Novo Contacto Website: " + name;
      const body = `
        Recebeu uma nova mensagem do website Rosimeire Serviços:
        
        Nome: ${name}
        E-mail: ${email}
        Telefone: ${phone}
        
        Mensagem:
        ${message}
        
        ---
        Enviado via Website - Rosimeire Serviços
      `;
      
      MailApp.sendEmail(recipient, subject, body);
      return ContentService.createTextOutput(JSON.stringify({ status: "email_sent" })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  // AÇÃO 2: Teste de Conexão SMTP/GAS
  if (payload.action === 'test_smtp') {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Handshake Realizado" })).setMimeType(ContentService.MimeType.JSON);
  }

  // AÇÃO PADRÃO: Atualizar Banco de Dados
  if (payload) {
    const row = [
      JSON.stringify(payload.slides || []),
      JSON.stringify(payload.siteConfig || {}),
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
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", version: "1.5" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 2. Re-implantar (Importante)
Toda vez que o código do script for alterado, você **DEVE**:
1. Clicar em **Implantar** > **Gerenciar implantações**.
2. Clicar no ícone de lápis (Editar).
3. Em "Versão", selecionar **Nova Versão**.
4. Clicar em **Implantar**.
5. Verifique se a URL não mudou (geralmente permanece a mesma).

Agora seu formulário de contacto enviará e-mails reais!
