# Rosimeire Serviços — Website & Ecossistema SIR
## Centro de Informações Técnicas e Diretrizes de Engenharia (`agents.md`)

Este documento serve como a **Fonte Única de Verdade (Single Source of Truth)** para agentes de inteligência artificial, desenvolvedores e engenheiros de software responsáveis pela manutenção, evolução e integridade do website oficial da **Rosimeire Serviços**.

---

## 1. Identidade e Propósito da Marca

* **Empresa:** Rosimeire Serviços — Serviços Premium de Limpeza, Curadoria e Governança Residencial & Comercial.
* **Localização Principal:** Quarteira, Vilamoura, Loulé, Faro — Algarve, Portugal.
* **Conceito de Design:** "Serenidade & Rigor". Estética de luxo silencioso (*quiet luxury*), tipografia serifada refinada para títulos, paleta base em tons profundos (`#081221`, `#040911`) com toques em tom rosê suave (`#f8c8c4`), cartões cristal translúcidos (*glassmorphism*) e animações fluidas via Framer Motion.
* **Público-alvo:** Proprietários de moradias e apartamentos de luxo, condomínios fechados, resorts turísticos, expatriados e clientes exigentes no Algarve.

---

## 2. Arquitetura do Sistema

```
                       ┌───────────────────────────────────────────────┐
                       │            Ecossistema Central SIR            │
                       │     (https://sir.rosimeireservicos.com)       │
                       │     • Painel ERP / Gestão / Operações         │
                       │     • Gravação & Atualização de Conteúdos     │
                       └───────────────────────┬───────────────────────┘
                                               │ Grava / Altera
                                               ▼
                       ┌───────────────────────────────────────────────┐
                       │          Banco de Dados Central               │
                       │         Supabase (PostgreSQL)                 │
                       │  • Schema: "WEBSITE"                          │
                       │  • Tabela: "database" (id = 1)                │
                       │  • Tabela: "contact_submissions" (Leads)      │
                       └───────────────────────┬───────────────────────┘
                                               │
                                               │ Consome (SELECT) &
                                               │ Envia Leads (INSERT)
                                               ▼
                       ┌───────────────────────────────────────────────┐
                       │         Website Público Rosimeire             │
                       │     • React 19 + TypeScript + Vite            │
                       │     • Sem painel administrativo local         │
                       │     • 100% focado no cliente & conversão      │
                       └───────────────────────────────────────────────┘
```

### Papéis Claros dos Ambientes:
1. **Website Público (este repositório):**
   * **Modo Read-Only para conteúdo:** Lê todas as configurações diretamente da tabela `WEBSITE.database` (id = 1).
   * **Modo Write-Only para leads:** Envia as mensagens preenchidas no formulário de contacto para a tabela `WEBSITE.contact_submissions`.
   * **Desacoplamento do Painel:** Não possui painel administrativo local nem telas de login internas. Todo o gerenciamento de conteúdo é feito de forma segura e centralizada no ecossistema SIR.
2. **SIR (Sistema Integrado Rosimeire):**
   * Central de comando oficial acessível pela equipe em `https://sir.rosimeireservicos.com`.
   * Um ícone discreto na barra de navegação e no menu mobile do site permite acesso direto da equipe ao SIR Portal.

---

## 3. Integração com Banco de Dados (Supabase / PostgreSQL)

### 3.1. Credenciais e Variáveis de Ambiente
As credenciais ficam armazenadas no arquivo `/.env.local`:
```env
VITE_SUPABASE_URL=https://cyjwvrmtmrkgxzcbjfsy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_gNwTPWmXLPtWiyEyPbnTPQ_6CHMoYxs
```
> **Nota Importante:** O cliente oficial em `/supabase.ts` trata automaticamente qualquer tentativa de digitação com final `.supabase.com` e a normaliza para `.supabase.co`.

### 3.2. Estrutura das Tabelas

#### A) Tabela `WEBSITE.database` (Registro Único `id = 1`)
Contém o estado global e o conteúdo editável do site:
* `id` *(integer, PK)*: Sempre igual a `1`.
* `slides` *(jsonb)*: Lista de slides do Hero Banner (id, title, tag, description, image, buttonText, buttonLink).
* `siteConfig` *(jsonb)*: Configurações globais (empresa, logo, slogans, nota de rodapé, links legais).
* `sectionImages` *(jsonb)*: URLs das imagens das secções "Sobre Nós" e "Carreiras".
* `socialLinks` *(jsonb)*: Links de redes sociais (Instagram, Facebook, LinkedIn, YouTube, TikTok).
* `emailConfig` *(jsonb)*: E-mail para notificações e recebimento.
* `notices` *(jsonb)*: Avisos da barra superior (id, text, active).
* `reviews` *(jsonb)*: Depoimentos e avaliações de clientes do Google.
* `partners` *(jsonb)*: Marcas e parceiros de prestígio.
* `googleMapsLink` *(text)*: Link oficial para o perfil e avaliações no Google Maps.
* `contactPhone` *(text)*: Telefone geral de atendimento (`+351 912 525 649`).
* `addressDetail` *(text)*: Endereço oficial em Quarteira, Faro, Algarve.
* `updated_at` *(timestamptz)*: Data/hora da última atualização realizada pelo SIR.

#### B) Tabela `WEBSITE.contact_submissions`
Armazena as mensagens e solicitações de orçamento enviadas pelos clientes:
* `id` *(bigint, PK auto-increment)*.
* `nome` *(text)*: Nome do cliente.
* `email` *(text)*: E-mail de contacto.
* `telefone` *(text)*: Telefone com indicativo internacional.
* `ddi` *(text)*: Código DDI do país (ex: `+351`, `+34`, `+44`).
* `mensagem` *(text)*: Mensagem descritiva ou pedido de orçamento.
* `created_at` *(timestamptz)*: Data e hora do envio.

---

## 4. Conformidade Legal e Regulatória em Portugal

O website cumpre rigorosamente as normas de defesa do consumidor da República Portuguesa:
1. **Livro de Reclamações Eletrónico:**
   * Acesso obrigatório e visível no rodapé (`https://www.livroreclamacoes.pt`).
2. **Resolução Alternativa de Litígios de Consumo (Lei n.º 144/2015):**
   * Informação ao Consumidor indicando a adesão ao **CIMAAL** (Centro de Informação, Mediação e Arbitragem de Consumo do Algarve — Tel: 289 823 135 | www.consumoalgarve.pt).
3. **Indicação e Transparência de Preços (Decreto-Lei n.º 138/90):**
   * Botão no rodapé para consulta pública do documento de Preçário em PDF (`/precario.pdf`).

---

## 5. Diretrizes de Frontend & Experiência do Utilizador

* **Idiomas Suportados:** Português (`PT`), Inglês (`EN`) e Espanhol (`ES`), com dicionário de traduções centralizado no arquivo principal.
* **Efeitos de Transição:** Uso de `framer-motion` para animações suaves entre seções, carregamento inicial (*InitialLoader*) e transição dos slides a cada 9 segundos.
* **Acessibilidade & Mobile:** Menu hambúrguer lateral de abertura suave em telas menores, botões de ação com alvos de toque adequados (mínimo 44px) e suporte a retina displays.
* **Acesso SIR Discreto:** Para preservar o minimalismo, o acesso ao SIR é feito exclusivamente por um ícone discreto (`LogIn`) no topo e no rodapé do menu mobile, sem textos agressivos ou banners invasivos.

---

## 6. Comandos e Manutenção

* **Instalação de Dependências:** `npm install`
* **Servidor de Desenvolvimento Local:** `npm run dev` (Porta 3000)
* **Build de Produção:** `npm run build`
* **Testar Pré-visualização:** `npm run preview`

---

*Documento mantido pela Equipa de Engenharia e Tecnologia da Rosimeire Serviços.*  
*Última atualização: Outubro de 2026.*
