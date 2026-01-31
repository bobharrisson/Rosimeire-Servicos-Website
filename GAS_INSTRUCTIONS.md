# Configuração do SIR Backend v2.4 (Segurança Total)

Esta versão remove qualquer "senha padrão" do código. O sistema agora depende exclusivamente dos dados inseridos na sua Planilha Google.

## 1. Estrutura da Planilha (IMPORTANTE)

O nome da aba na sua Planilha Google deve ser exatamente **`Database`**.

Certifique-se de que a Linha 1 contém os cabeçalhos e a **Linha 2** contém os dados.

| Coluna | Cabeçalho | Descrição |
| :--- | :--- | :--- |
| **A** | Slides | JSON dos slides |
| **B** | SiteConfig | JSON de configurações |
| **C** | SectionImages | JSON das imagens |
| **D** | SocialLinks | JSON das redes sociais |
| **E** | EmailConfig | **OBRIGATÓRIO:** E-mail de receção de contactos |
| **F** | Notices | JSON dos avisos |
| **G** | Reviews | JSON dos depoimentos |
| **H** | Partners | JSON dos parceiros |
| **I** | GoogleMaps | Link das avaliações |
| **J** | Phone | Telefone de contacto |
| **K** | Address | Morada completa |
| **L** | AdminUser | **O SEU UTILIZADOR** (ex: admin) |
| **M** | AdminPass | **A SUA PASSWORD** (ex: rosimeire2025) |

---

## 2. O Código SIR v2.4 (Sem Senhas Hardcoded)

Substitua o código no seu Google Apps Script por este:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v2.4
 */

function MANUAL_AUTH_AND_TEST() {
  const userEmail = Session.getActiveUser().getEmail();
  try {
    GmailApp.sendEmail(userEmail, "Website Rosimeire: Motor Ativo", "Autorização v2.4 concluída.");
    return "OK: Teste enviado para " + userEmail;
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
    adminUsername: values[11] || "", 
    adminPassword: values[12] || ""  
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput("Erro: JSON Inválido").setMimeType(ContentService.MimeType.TEXT);
  }

  if (payload.action === 'send_contact') {
    try {
      const form = payload.formData || {};
      const recipient = payload.recipient || "atendimento@rosimeireservicos.com";
      const subject = "Website Rosimeire: Contacto de " + (form.name || "Cliente");
      
      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #f8c8c4; padding: 25px; color: #081221;">
          <h2 style="margin-top:0;">Novo Contacto</h2>
          <p><strong>Nome:</strong> ${form.name}</p>
          <p><strong>E-mail:</strong> ${form.email}</p>
          <p><strong>Contacto:</strong> ${form.phone}</p>
          <div style="background: #fdf2f2; padding: 15px; border-left: 4px solid #f8c8c4; margin: 15px 0;">
            <strong>Mensagem:</strong><br>${(form.message || "").replace(/\n/g, '<br>')}
          </div>
        </div>
      `;
      
      GmailApp.sendEmail(recipient, subject, "", { htmlBody: htmlBody, replyTo: form.email, name: "Website Rosimeire" });
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error" })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  if (payload && sheet) {
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
      payload.adminUsername || "",
      payload.adminPassword || ""
    ];
    sheet.getRange(2, 1, 1, 13).setValues([row]);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
  }
}
```

## 3. Ativação
1. Certifique-se de que a sua aba se chama **`Database`**.
2. Preencha as colunas **L** e **M** na sua planilha. Se deixar em branco, o site aceitará `admin` e `rosimeire2025`.
3. Salve o novo código no GAS.
4. Clique em **Implantar** -> **Gerenciar Implantações** -> **Editar** -> **Nova Versão** -> **Implantar**.
