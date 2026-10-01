# Relatório Técnico de Migração de Dados
## De Google Sheets (SIR Backend v2.4/v2.6) para PostgreSQL / Supabase
**Website:** Rosimeire Serviços — Algarve, Portugal  
**Data do Levantamento:** 2026-10-01  
**Autor:** Engenharia de Sistemas / Bob Harrisson Gracindo Madeiro

---

## Índice
1. [Visão Geral da Arquitetura Atual](#1-visão-geral-da-arquitetura-atual)
2. [Estrutura da Planilha / Google Sheets (`Database`)](#2-estrutura-da-planilha--google-sheets-database)
3. [Dicionário de Dados e Subestruturas JSON](#3-dicionário-de-dados-e-subestruturas-json)
4. [Painel Administrativo Atual (Seções, Telas e Regras de Negócio)](#4-painel-administrativo-atual-seções-telas-e-regras-de-negócio)
5. [Mapeamento de Consumo no Frontend](#5-mapeamento-de-consumo-no-frontend)
6. [Proposta de Modelagem Relacional para PostgreSQL / Supabase (DDL SQL)](#6-proposta-de-modelagem-relacional-para-postgresql--supabase-ddl-sql)

---

## 1. Visão Geral da Arquitetura Atual

Atualmente, o website opera com uma arquitetura serverless híbrida:
* **Frontend:** React 19 + TypeScript + Tailwind CSS (Vite SPA) com suporte a animações (Framer Motion) e biblioteca de ícones Lucide.
* **Backend Atual:** Google Apps Script (GAS) Web App vinculado a uma Google Spreadsheet (`Database`).
* **Sincronização:**
  * **Leitura (`GET`):** Endpoint GAS `doGet()` lê a Linha 2 da aba `Database` e devolve um JSON unificado.
  * **Gravação (`POST`):** O painel administrativo envia via `fetch` assíncrono todo o estado consolidado da aplicação em formato JSON para ser sobrescrito na Linha 2 da aba `Database`.
  * **Disparo de E-mails (`POST` com `action: 'send_contact'`):** O formulário de contacto envia os dados preenchidos diretamente ao script GAS, que utiliza `GmailApp.sendEmail()` para entregar a mensagem no e-mail configurado.
* **Cache Local:** Para performance e tolerância a falhas, o website persiste réplicas de todas as configurações no `localStorage` do navegador com o prefixo `rosimeire_config_v15_manager_*`.

---

## 2. Estrutura da Planilha / Google Sheets (`Database`)

O sistema consome **uma única aba** na planilha oficial:
* **Nome Exato da Aba:** `Database`
* **Linha 1:** Cabeçalhos oficiais (13 colunas, de A até M).
* **Linha 2:** Registro contendo os dados reais da aplicação.

### Mapeamento das Colunas (A até M)

| Coluna | Cabeçalho Exato | Tipo na Planilha | Tipo / Subestrutura TypeScript | Descrição Funcional |
| :---: | :--- | :--- | :--- | :--- |
| **A** | `Slides` | String (JSON) | `Slide[]` | Lista dinâmica de slides rotativos da seção Hero. |
| **B** | `SiteConfig` | String (JSON) | `SiteConfig` (Objeto) | Identidade visual, rodapé, livro de reclamações, preçário e biblioteca de efeitos de magia. |
| **C** | `SectionImages` | String (JSON) | `SectionImages` (Objeto) | Imagens de destaque das páginas Sobre e Carreiras. |
| **D** | `SocialLinks` | String (JSON) | `SocialLinks` (Objeto) | URLs dos perfis das redes sociais. |
| **E** | `EmailConfig` | String (JSON) | `EmailConfig` (Objeto) | E-mail de receção dos formulários de contacto. |
| **F** | `Notices` | String (JSON) | `Notice[]` | Avisos e alertas da barra superior (Top Bar). |
| **G** | `Reviews` | String (JSON) | `Review[]` | Depoimentos e testemunhos de clientes. |
| **H** | `Partners` | String (JSON) | `Partner[]` | Marcas e empresas parceiras de prestígio. |
| **I** | `GoogleMaps` | String | `string` (URL) | Link direto para as avaliações no Google Maps. |
| **J** | `Phone` | String | `string` (Telefone) | Telefone/WhatsApp oficial de atendimento. |
| **K** | `Address` | String | `string` (Texto/Morada) | Morada física da sede em Quarteira, Algarve. |
| **L** | `AdminUser` | String | `string` (Username) | Nome de utilizador de acesso ao painel admin (padrão: `admin`). |
| **M** | `AdminPass` | String | `string` (Senha) | Senha de acesso ao painel admin (padrão: `rosimeire2025`). |

---

## 3. Dicionário de Dados e Subestruturas JSON

### 3.1. `Slide` (Coluna A - `Slides`)
```typescript
interface Slide {
  id: string;          // Identificador único (ex: "1", "1715800000000")
  title: string;       // Título principal (ex: "SERENIDADE & RIGOR")
  description: string; // Descrição breve (ex: "Cuidamos da sua casa...")
  image: string;       // URL da imagem de fundo (Unsplash ou CDN)
  tag: string;         // Tag temática (ex: "A ESSÊNCIA")
  buttonLink?: string; // Link/Âncora (ex: "contact", "about", "#services", URL externa)
  buttonText?: string; // Rótulo do botão CTA (ex: "MARCAR AGORA")
}
```

### 3.2. `SiteConfig` (Coluna B - `SiteConfig`)
```typescript
interface SiteConfig {
  logoUrl: string;              // URL da logomarca oficial (PNG ou SVG transparente)
  companyName: string;          // Nome principal (ex: "ROSIMEIRE")
  companySubtitle: string;      // Subtítulo / Slogan (ex: "SERVIÇOS")
  footerNote: string;           // Nota de rodapé (ex: "A alma do Algarve bem cuidada.")
  footerCopyright: string;      // Copyright (ex: "© 2025. Rosimeire Serviços - Algarve.")
  developedBy: string;          // Créditos técnicos (ex: "Bob Harrisson Gracindo Madeiro")
  complaintsBookUrl: string;    // Link do Livro de Reclamações (ex: "https://www.livroreclamacoes.pt")
  consumerInfoTitle: string;    // Título legal (ex: "Informação ao Consumidor (Lei 144/2015)")
  consumerInfoText: string;     // Texto legal sobre o CIMAAL
  consumerInfoContact: string;  // Contactos do CIMAAL (ex: "Tel: 289 823 135 | www.consumoalgarve.pt")
  priceListUrl: string;         // URL do documento PDF com o preçário (ex: "/precario.pdf")
  priceListTitle: string;       // Título legal (ex: "Preçário e Transparência (DL 138/90)")
  priceListText: string;        // Texto de enquadramento legal do DL 138/90
  magicEffect: {
    activeId: string | null;    // ID do efeito ativo no momento (ou null)
    items: Array<{
      id: string;               // Identificador do efeito
      name: string;             // Nome do evento (ex: "Neve no Algarve")
      code: string;             // Código CSS puro injetado na camada .magic-event-layer
      prompt: string;           // Prompt original utilizado na IA (Gemini)
      startDate: string;        // Data de início da vigência (YYYY-MM-DD)
      endDate: string;          // Data de término da vigência (YYYY-MM-DD)
    }>;
  };
}
```

### 3.3. `SectionImages` (Coluna C - `SectionImages`)
```typescript
interface SectionImages {
  about: string;   // URL da imagem na página "Sobre Nós"
  careers: string; // URL da imagem na página "Carreiras / Recrutamento"
}
```

### 3.4. `SocialLinks` (Coluna D - `SocialLinks`)
```typescript
interface SocialLinks {
  instagram: string; // URL do Instagram
  linkedin: string;  // URL do LinkedIn
  facebook: string;  // URL do Facebook
  youtube: string;   // URL do YouTube
  tiktok: string;    // URL do TikTok
}
```

### 3.5. `EmailConfig` (Coluna E - `EmailConfig`)
```typescript
interface EmailConfig {
  recipientEmail: string; // E-mail que recebe os formulários de contacto
}
```

### 3.6. `Notice` (Coluna F - `Notices`)
```typescript
interface Notice {
  id: string;      // Identificador único
  text: string;    // Conteúdo da mensagem exibida no topo do site
  active: boolean; // Flag de visibilidade (true: visível / false: oculto)
}
```

### 3.7. `Review` (Coluna G - `Reviews`)
```typescript
interface Review {
  id: string;        // Identificador único
  author: string;    // Nome do cliente
  text: string;      // Depoimento do cliente
  time: string;      // Período relativo (ex: "12 meses atrás")
  avatar?: string;   // URL opcional da foto de perfil
  initials: string;  // Iniciais para avatar substituto (máximo 2 caracteres)
  color: string;     // Cor hexadecimal do círculo de avatar (ex: "#386624")
}
```

### 3.8. `Partner` (Coluna H - `Partners`)
```typescript
interface Partner {
  id: string;   // Identificador único
  name: string; // Nome da marca ou empresa parceira
  logo: string; // URL da logomarca do parceiro
  url: string;  // Link oficial do website do parceiro
}
```

### 3.9. Exemplo Real Completo da Linha 2 em JSON
```json
{
  "slides": [
    {
      "id": "1",
      "title": "SERENIDADE & RIGOR",
      "description": "Cuidamos da sua casa para que você possa apenas sentir o momento.",
      "image": "https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600",
      "tag": "A ESSÊNCIA",
      "buttonLink": "contact",
      "buttonText": "MARCAR AGORA"
    },
    {
      "id": "2",
      "title": "DETALHES ESSENCIAIS",
      "description": "Uma casa limpa é um refúgio para a alma. Nossa curadoria é invisível, mas sentida.",
      "image": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600",
      "tag": "O CUIDADO",
      "buttonLink": "about",
      "buttonText": "CONHECER EQUIPA"
    }
  ],
  "siteConfig": {
    "logoUrl": "",
    "companyName": "ROSIMEIRE",
    "companySubtitle": "SERVIÇOS",
    "footerNote": "A alma do Algarve bem cuidada.",
    "footerCopyright": "© 2025. Rosimeire Serviços - Algarve.",
    "developedBy": "Bob Harrisson Gracindo Madeiro",
    "complaintsBookUrl": "https://www.livroreclamacoes.pt",
    "consumerInfoTitle": "Informação ao Consumidor (Lei 144/2015)",
    "consumerInfoText": "Em caso de litígio, o consumidor pode recorrer ao Centro de Informação, Mediação e Arbitragem de Consumo do Algarve (CIMAAL).",
    "consumerInfoContact": "Tel: 289 823 135 | www.consumoalgarve.pt",
    "priceListUrl": "/precario.pdf",
    "priceListTitle": "Preçário e Transparência (DL 138/90)",
    "priceListText": "O Decreto-Lei n.º 138/90, de 26 de abril, alterado pelo DL n.º 162/99, de 13 de maio, regula a obrigatoriedade de afixação de preços para bens e serviços ao consumidor em Portugal. Exige que o preço total (incluindo taxas e impostos) seja indicado de forma clara, visível e inequívoca, garantindo a transparência.",
    "magicEffect": {
      "activeId": null,
      "items": []
    }
  },
  "sectionImages": {
    "about": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    "careers": "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1200"
  },
  "socialLinks": {
    "instagram": "#",
    "linkedin": "#",
    "facebook": "#",
    "youtube": "#",
    "tiktok": "#"
  },
  "emailConfig": {
    "recipientEmail": "atendimento@rosimeireservicos.com"
  },
  "notices": [
    {
      "id": "1",
      "text": "Nova especialidade de Limpeza Técnica de Cristais agora disponível.",
      "active": true
    }
  ],
  "reviews": [
    {
      "id": "1",
      "author": "Yeudy b",
      "text": "Limpeza impecável, o serviço foi 10/10 e super rápido. Definitivamente contarei com eles no futuro.",
      "time": "12 meses atrás",
      "initials": "Y",
      "color": "#386624"
    },
    {
      "id": "2",
      "author": "Alex Alcivar",
      "text": "Auténtico profesionales en el sector, sin duda muito por encima de la competence!! Cuidan cada detalhe.",
      "time": "12 meses atrás",
      "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      "initials": "AA",
      "color": "#1a365d"
    }
  ],
  "partners": [
    { "id": "1", "name": "Algarve Living", "logo": "https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600", "url": "#" },
    { "id": "2", "name": "Ocean Estates", "logo": "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600", "url": "#" },
    { "id": "3", "name": "Serenity Rentals", "logo": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", "url": "#" },
    { "id": "4", "name": "Elite Homes", "logo": "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800", "url": "#" }
  ],
  "googleMapsLink": "https://www.google.com/search?q=Rosimeire+Servi%C3%A7os+Quarteira",
  "contactPhone": "+351 912 525 649",
  "addressDetail": "R. 25 de Abril 49, 8125-234, Quarteira, Faro Algarve – Portugal",
  "adminUsername": "admin",
  "adminPassword": "rosimeire2025"
}
```

---

## 4. Painel Administrativo Atual (Seções, Telas e Regras de Negócio)

O painel é acessível via ícone de engrenagem e protegido pelo **Modal de Autenticação** (`adminUsername` / `adminPassword`).

### Estrutura das 8 Abas do Painel

#### 1. Aba "Geral" (`tab === 'site'`)
* **Criador de Magia (Biblioteca de Efeitos CSS com Gemini AI):**
  * `magicForm.name` (Input texto): Nome descritivo do evento sazonal.
  * `magicForm.prompt` (Textarea): Instrução enviada ao Gemini para gerar regras CSS puras direcionadas à classe `.magic-event-layer`.
  * `magicForm.startDate` e `magicForm.endDate` (Inputs tipo date): Período de exibição automática.
  * **Biblioteca de Efeitos:** Lista todos os eventos salvos, indicando status dinâmico (`AGENDADO`, `DISPONÍVEL`, `EXPIRADO`), botão de teste ao vivo no DOM, botão de Ativar/Desativar e exclusão com modal de confirmação.
* **Configurações Gerais (Layout em Grade 4 Colunas Lado a Lado):**
  * **Botão Superior:** `SINCRONIZAR COM A NUVEM` (persiste as configurações imediatamente).
  * **Card 1 — Identidade Visual:** `logoUrl`, `companyName`, `companySubtitle`.
  * **Card 2 — Rodapé & Copyright:** `footerNote`, `footerCopyright`, `developedBy`.
  * **Card 3 — Consumidor & Legal (Livro de Reclamações):** `complaintsBookUrl`, `consumerInfoTitle`, `consumerInfoText`, `consumerInfoContact`.
  * **Card 4 — Preçário (DL 138/90):** `priceListUrl`, `priceListTitle`, `priceListText`.

#### 2. Aba "Slides" (`tab === 'slides'`)
* **Gerenciador de Banners:**
  * Lista dinâmica com botões de exclusão por slide (regra: impede exclusão se houver apenas 1 slide ativo).
  * Botão `+ Adicionar Novo Slide de Destaque`.
  * Campos: `image` (URL), `tag` (Texto badge), `title` (Título), `description` (Descrição), `buttonText` (Texto CTA) e `buttonLink` (Link/Âncora).

#### 3. Aba "Visual" (`tab === 'images'`)
* **Curadoria de Imagens:**
  * Preview em tempo real e input de URL para a imagem da seção "Sobre Nós" (`sectionImages.about`).
  * Preview em tempo real e input de URL para a imagem da seção "Carreiras" (`sectionImages.careers`).

#### 4. Aba "E-mail / Redes" (`tab === 'email'`)
* **Contactos Oficiais:**
  * `emailConfig.recipientEmail` (E-mail de destino dos formulários).
  * `contactPhone` (Telemóvel oficial de atendimento).
  * `addressDetail` (Morada completa da sede).
* **Canais Sociais:**
  * `socialLinks.instagram`, `socialLinks.facebook`, `socialLinks.youtube`, `socialLinks.tiktok`, `socialLinks.linkedin`.

#### 5. Aba "Avisos" (`tab === 'notices'`)
* **Barra de Notificações:**
  * Lista dinâmica de avisos com campo de texto (`text`).
  * Botão Toggle para ativar/desativar individualmente cada aviso (`active: boolean`).
  * Botão de exclusão e botão `+ Adicionar Novo Aviso`.

#### 6. Aba "Legado" (`tab === 'reviews'`)
* **Depoimentos de Clientes:**
  * Campo global: `googleMapsLink` (Link direto para avaliações no Google Maps).
  * Cards de depoimentos com: `author`, `time`, `avatar` (URL opcional), `text`, `initials` (iniciais de até 2 caracteres) e `color` (`input[type="color"]` para o círculo de fundo caso não haja foto).
  * Botão de exclusão e botão `+ Adicionar Novo Depoimento`.

#### 7. Aba "Parceiros" (`tab === 'partners'`)
* **Parceiros de Prestígio:**
  * Cards para cada parceiro: `name`, `logo` (URL da logomarca) e `url` (link externo).
  * Botão de exclusão e botão `+ Adicionar Parceiro de Prestígio`.

#### 8. Aba "Conta" (`tab === 'user'`)
* **Credenciais Administrativas:**
  * `adminUsername` e `adminPassword` (com botão de alternar visibilidade `Eye` / `EyeOff`).

#### Rodapé Global do Painel
* Status dinâmico da nuvem (`Sincronizado`, `A Sincronizar...`, `Erro de Ligação`).
* Botão principal: `PUBLICAR ALTERAÇÕES NO SITE`.
* Botão de contingência: `Limpar Cache Local & Recarregar`.

---

## 5. Mapeamento de Consumo no Frontend

| Componente / Seção do Site | Propriedade Consumida | Como e Onde é Renderizado |
| :--- | :--- | :--- |
| **SEO & Metatags** | `siteConfig.logoUrl` | Injetado dinamicamente na tag `<link rel="shortcut icon">`. |
| **SEO & Metatags** | `companyName`, `companySubtitle` | Injetado dinamicamente em `document.title` (`ROSIMEIRE SERVIÇOS`). |
| **Splash Screen (Loader)** | `logoUrl`, `companyName`, `companySubtitle` | Exibido com transição de opacidade/escala antes do carregamento completo da página. |
| **Barra de Avisos (Top Banner)** | `notices` (onde `active: true`) | Banner superior com ícone de sino animado. Clique redireciona automaticamente para a tela de contacto. |
| **Navbar (Identidade)** | `logoUrl`, `companyName`, `companySubtitle` | Logotipo e tipografia principal no canto superior esquerdo com efeito hover. |
| **Navbar (Ações)** | Dicionário de Idiomas + Links Globais | Seletor de idiomas (`PT`, `EN`, `ES`), link direto para o sistema corporativo `SIR` e botão de engrenagem para acesso ao Admin. |
| **Efeitos Mágicos (Overlay)** | `siteConfig.magicEffect` | Elemento fixo em tela cheia (`.magic-event-layer`) onde o CSS gerado por IA é ativado dinamicamente segundo as datas de início e fim. |
| **Hero / Banners** | `slides` (carrossel de 9s) | `image` (fundo com gradientes), `tag` (etiqueta superior), `title` (título em duas tonalidades), `description` (texto), `buttonText` e `buttonLink` (botão de ação com roteamento interno para views ou links externos). |
| **Catálogo de Serviços** | Dicionário multilíngue (`translations[lang]`) | Renderiza os textos institucionais e 4 cartões de especialidades (Alojamentos Turísticos, Residências Particulares, Detalhe de Precisão, Limpezas Pós-Obra). |
| **Legado / Depoimentos** | `reviews` (carrossel de 8s) | Foto (`avatar`) ou iniciais estilizadas (`initials` + `color`), 5 estrelas douradas, texto do depoimento, autor e tempo da avaliação. |
| **Legado / Depoimentos** | `googleMapsLink` | Botão "Ver todas no Google" abrindo a ficha do Google Maps da empresa. |
| **Parceiros de Prestígio** | `partners` (carrossel de 5s) | Logomarca (`logo`), nome do parceiro (`name`) e link (`url`) com efeitos de grayscale e zoom. |
| **Página "Sobre" (`view === 'about'`)** | `sectionImages.about` + `companyName` | Imagem editorial de alta resolução ao lado da história institucional da empresa (desde 2011), Missão, Visão e Valores. |
| **Página "Carreiras" (`view === 'careers'`)** | `sectionImages.careers` + Textos | Imagem principal, aviso legal de recrutamento geográfico no Algarve (Concelho de Loulé / Freguesia de Quarteira) e link para formulário de candidatura. |
| **Página "Contacto" (`view === 'contact'`)** | `addressDetail`, `emailConfig.recipientEmail`, `contactPhone`, `socialLinks` | Morada física, e-mail clicável, telefone com link direto para WhatsApp (`wa.me/...`) e ícones de redes sociais. |
| **Formulário de Contacto** | `emailConfig.recipientEmail` | Formulário completo com seletor internacional de DDI (21 países), validação e envio por e-mail via backend. |
| **Mapa Interativo (Quarteira)** | `addressDetail`, `logoUrl`, `companyName`, `companySubtitle` | Iframe do Google Maps integrado com card flutuante contendo classificação 5.0 estrelas e botão "COMO CHEGAR". |
| **Rodapé (Institucional & Redes)** | `logoUrl`, `companyName`, `companySubtitle`, `footerNote`, `socialLinks` | Logomarca, slogan, descrição da empresa e links sociais com hover interativo. |
| **Rodapé (Livro de Reclamações)** | `complaintsBookUrl`, `consumerInfoTitle`, `consumerInfoText`, `consumerInfoContact` | Bloco da Lei 144/2015 sobre o CIMAAL e card de destaque em vermelho escuro (`#4c0519`) com círculo branco estilizado direcionando para `livroreclamacoes.pt`. |
| **Rodapé (Preçário DL 138/90)** | `priceListUrl`, `priceListTitle`, `priceListText` | Bloco informativo sobre a afixação de preços em Portugal com botão dourado com ícone de documento para abertura do PDF do preçário. |
| **Rodapé (Copyright & Créditos)** | `footerCopyright`, `developedBy` | Linha de direitos autorais e créditos ao departamento de desenvolvimento e TI. |

---

## 6. Proposta de Modelagem Relacional para PostgreSQL / Supabase (DDL SQL)

Para a migração da linha única serializada no Google Sheets para o modelo relacional de alta performance e segurança no PostgreSQL / Supabase, segue o schema normalizado sugerido:

```sql
-- 1. EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABELA DE CONFIGURAÇÕES GERAIS (SINGLETON)
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(100) NOT NULL DEFAULT 'ROSIMEIRE',
    company_subtitle VARCHAR(100) NOT NULL DEFAULT 'SERVIÇOS',
    logo_url TEXT DEFAULT '',
    footer_note TEXT DEFAULT 'A alma do Algarve bem cuidada.',
    footer_copyright TEXT DEFAULT '© 2025. Rosimeire Serviços - Algarve.',
    developed_by VARCHAR(150) DEFAULT 'Bob Harrisson Gracindo Madeiro',
    contact_phone VARCHAR(50) DEFAULT '+351 912 525 649',
    contact_address TEXT DEFAULT 'R. 25 de Abril 49, 8125-234, Quarteira, Faro Algarve – Portugal',
    recipient_email VARCHAR(255) DEFAULT 'atendimento@rosimeireservicos.com',
    google_maps_link TEXT DEFAULT 'https://www.google.com/search?q=Rosimeire+Servi%C3%A7os+Quarteira',
    about_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    careers_image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&q=80&w=1200',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. TABELA DE CONFORMIDADE LEGAL (LIVRO DE RECLAMAÇÕES & PREÇÁRIO)
CREATE TABLE legal_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaints_book_url TEXT NOT NULL DEFAULT 'https://www.livroreclamacoes.pt',
    consumer_info_title TEXT NOT NULL DEFAULT 'Informação ao Consumidor (Lei 144/2015)',
    consumer_info_text TEXT NOT NULL DEFAULT 'Em caso de litígio, o consumidor pode recorrer ao Centro de Informação, Mediação e Arbitragem de Consumo do Algarve (CIMAAL).',
    consumer_info_contact TEXT NOT NULL DEFAULT 'Tel: 289 823 135 | www.consumoalgarve.pt',
    price_list_url TEXT NOT NULL DEFAULT '/precario.pdf',
    price_list_title TEXT NOT NULL DEFAULT 'Preçário e Transparência (DL 138/90)',
    price_list_text TEXT NOT NULL DEFAULT 'O Decreto-Lei n.º 138/90, de 26 de abril, alterado pelo DL n.º 162/99, de 13 de maio, regula a obrigatoriedade de afixação de preços para bens e serviços ao consumidor em Portugal. Exige que o preço total (incluindo taxas e impostos) seja indicado de forma clara, visível e inequívoca, garantindo a transparência.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. TABELA DE REDES SOCIAIS
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instagram TEXT DEFAULT '#',
    linkedin TEXT DEFAULT '#',
    facebook TEXT DEFAULT '#',
    youtube TEXT DEFAULT '#',
    tiktok TEXT DEFAULT '#',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. TABELA DE SLIDES DA HERO (BANNERS)
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tag VARCHAR(100) NOT NULL DEFAULT 'A ESSÊNCIA',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    button_text VARCHAR(100) DEFAULT 'MARCAR AGORA',
    button_link VARCHAR(255) DEFAULT 'contact',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TABELA DE AVISOS (TOP BANNER)
CREATE TABLE notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. TABELA DE DEPOIMENTOS (REVIEWS)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    time_label VARCHAR(100) NOT NULL DEFAULT '12 meses atrás',
    avatar_url TEXT DEFAULT '',
    initials VARCHAR(4) NOT NULL DEFAULT 'NA',
    color_hex VARCHAR(20) NOT NULL DEFAULT '#1a365d',
    rating INT NOT NULL DEFAULT 5,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. TABELA DE PARCEIROS DE PRESTÍGIO
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT NOT NULL DEFAULT '#',
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. TABELA DE EVENTOS DE MAGIA (ANIMAÇÕES CSS & IA)
CREATE TABLE magic_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    prompt TEXT NOT NULL,
    css_code TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. TABELA DE MENSAGENS DE CONTACTO (LEADS / FORMULÁRIO)
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    ddi VARCHAR(10) DEFAULT '+351',
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'read', 'archived'
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. INSERÇÃO DOS DADOS INICIAIS
INSERT INTO site_settings (company_name, company_subtitle) VALUES ('ROSIMEIRE', 'SERVIÇOS');
INSERT INTO legal_compliance DEFAULT VALUES;
INSERT INTO social_links DEFAULT VALUES;

INSERT INTO hero_slides (tag, title, description, image_url, button_text, button_link, sort_order) VALUES
('A ESSÊNCIA', 'SERENIDADE & RIGOR', 'Cuidamos da sua casa para que você possa apenas sentir o momento.', 'https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600', 'MARCAR AGORA', 'contact', 1),
('O CUIDADO', 'DETALHES ESSENCIAIS', 'Uma casa limpa é um refúgio para a alma. Nossa curadoria é invisível, mas sentida.', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600', 'CONHECER EQUIPA', 'about', 2);

INSERT INTO notices (text, is_active) VALUES
('Nova especialidade de Limpeza Técnica de Cristais agora disponível.', TRUE);

INSERT INTO reviews (author, text, time_label, initials, color_hex, rating) VALUES
('Yeudy b', 'Limpeza impecável, o serviço foi 10/10 e super rápido. Definitivamente contarei com eles no futuro.', '12 meses atrás', 'Y', '#386624', 5),
('Alex Alcivar', 'Auténtico profesionales en el sector, sin duda muito por encima de la competence!! Cuidan cada detalhe.', '12 meses atrás', 'AA', '#1a365d', 5);

INSERT INTO partners (name, logo_url, website_url, sort_order) VALUES
('Algarve Living', 'https://images.unsplash.com/photo-1600607687940-4e7a6a353d2c?auto=format&fit=crop&q=80&w=1600', '#', 1),
('Ocean Estates', 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1600', '#', 2),
('Serenity Rentals', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200', '#', 3),
('Elite Homes', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800', '#', 4);
```

---

## 7. Implementação do Cliente Supabase no Website (Instruções Executadas)

### 7.1. Dependências Instaladas
* `@supabase/supabase-js`

### 7.2. Variáveis de Ambiente (`.env.local` e `.env.example`)
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

### 7.3. Cliente Instanciado (`/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 7.4. Leitura Unificada dos Dados do Site
```typescript
const { data, error } = await supabase
  .schema('WEBSITE')
  .from('database')
  .select('*')
  .eq('id', 1)
  .single();
```

### 7.5. Submissão do Formulário de Contacto
```typescript
await supabase
  .schema('WEBSITE')
  .from('contact_submissions')
  .insert([{ nome, email, telefone, ddi, mensagem }]);
```

### 7.6. Atualização / Gravação via Painel de Controlo
```typescript
await supabase
  .schema('WEBSITE')
  .from('database')
  .update(payload)
  .eq('id', 1);
```

---
*Documento gerado e validado com base no código-fonte e nas regras de negócio ativas do projeto.*
