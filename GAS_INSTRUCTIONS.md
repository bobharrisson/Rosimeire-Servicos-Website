# Configuração do Banco de Dados Sincronizado (Campos Separados)

Este novo script organiza sua planilha em colunas, facilitando a leitura e removendo a necessidade de gerenciar um único bloco de JSON gigante.

## 1. Preparar a Planilha
1. Crie uma nova **Planilha Google**.
2. Nomeie a primeira aba como `Database`.
3. Na linha 1 (cabeçalhos), você pode escrever os nomes das categorias nas colunas A até H para se organizar:
   - A: Slides
   - B: SectionImages
   - C: SocialLinks
   - D: EmailConfig
   - E: Notices
   - F: Reviews
   - G: Partners
   - H: MapsLink

## 2. Configurar o Script (Separado por Colunas)
1. Vá em **Extensões** > **Apps Script**.
2. Substitua o código antigo por este:

```javascript
/**
 * Google Apps Script - Rosimeire Serviços (Versão Campos Separados)
 * Este script mapeia cada categoria de dados para uma coluna específica.
 */

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const values = sheet.getRange(2, 1, 1, 8).getValues()[0]; // Lê a linha 2, colunas A-H
  
  // Reconstrói o objeto para o site
  const data = {
    slides: JSON.parse(values[0] || "[]"),
    sectionImages: JSON.parse(values[1] || "{}"),
    socialLinks: JSON.parse(values[2] || "{}"),
    emailConfig: JSON.parse(values[3] || "{}"),
    notices: JSON.parse(values[4] || "[]"),
    reviews: JSON.parse(values[5] || "[]"),
    partners: JSON.parse(values[6] || "[]"),
    googleMapsLink: values[7] || ""
  };
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Database");
  const payload = JSON.parse(e.postData.contents);
  
  if (payload) {
    // Mapeia o objeto recebido para as colunas A-H na linha 2
    const row = [
      JSON.stringify(payload.slides || []),
      JSON.stringify(payload.sectionImages || {}),
      JSON.stringify(payload.socialLinks || {}),
      JSON.stringify(payload.emailConfig || {}),
      JSON.stringify(payload.notices || []),
      JSON.stringify(payload.reviews || []),
      JSON.stringify(payload.partners || []),
      payload.googleMapsLink || ""
    ];
    
    sheet.getRange(2, 1, 1, 8).setValues([row]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Implantar (Deploy)
1. Clique em **Implantar** > **Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Eu**.
4. Quem tem acesso: **Qualquer pessoa**.
5. Copie a URL gerada.

---
**Nota Técnica**: Agora, ao clicar em "GUARDAR & FINALIZAR" no painel administrativo, o site enviará os dados automaticamente para esta API, que distribuirá as informações nas colunas da sua planilha. Isso torna o backup muito mais legível e profissional.