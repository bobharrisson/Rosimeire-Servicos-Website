# Configuração do Banco de Dados Sincronizado v1.4 (Suporte a Eventos Mágicos)

Este script organiza a sua planilha em colunas dedicadas, permitindo que o site salve e recupere todas as configurações, incluindo os efeitos gerados por IA, dados de contacto e credenciais administrativas.

## 1. Preparar a Planilha
1. Crie uma nova **Planilha Google**.
2. Nomeie a primeira aba como `Database`.
3. Na linha 1 (cabeçalhos), organize as colunas de **A até M**:
   - A: Slides | B: SiteConfig (Inclui Magia) | C: SectionImages | D: SocialLinks | E: EmailConfig
   - F: Notices | G: Reviews | H: Partners | I: MapsLink | J: Phone | K: Address 
   - L: AdminUser | M: AdminPass

## 2. Configurar o Script v1.4
1. Na sua planilha, vá em **Extensões** > **Apps Script**.
2. Substitua todo o código existente por este:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços v1.4
 * Sincronização completa de Identidade, Contactos e Eventos Mágicos.
 */

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  // Lê a linha 2, colunas A até M (13 colunas)
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
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const payload = JSON.parse(e.postData.contents);
  
  if (payload) {
    // Mapeia o objeto recebido para as colunas A-M
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
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success", version: "1.4" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Implantar (Deploy)
1. Clique no botão azul **Implantar** > **Nova implantação**.
2. Selecione o tipo **App da Web**.
3. Descrição: `Sincronização v1.4`.
4. Executar como: **Eu** (seu e-mail).
5. Quem tem acesso: **Qualquer pessoa** (essencial para o site comunicar).
6. Clique em **Implantar**, autorize as permissões e copie a **URL do App da Web**.

## 4. Ativar no Site
1. Aceda ao Painel Administrativo do seu site.
2. No topo, verifique se a URL no campo "Endpoint SIR" corresponde à URL que acabou de copiar.
3. Clique em **GUARDAR & FINALIZAR**. Agora todos os seus "Eventos Mágicos" e configurações estão seguros na nuvem!
