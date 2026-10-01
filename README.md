<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Rosimeire Serviços — Website Oficial

Website institucional moderno de serviços de limpeza premium no Algarve (Quarteira, Vilamoura, Faro), integrado ao **Ecossistema Central SIR** e ao **Supabase (PostgreSQL)**.

---

## 🚀 Principais Atualizações (Migração Supabase)

- **Banco de Dados Central:** Conexão direta com Supabase PostgreSQL (`WEBSITE.database` e `WEBSITE.contact_submissions`).
- **Arquitetura Desacoplada:** Gerenciamento de conteúdo centralizado no **SIR Ecosystem** (`https://sir.rosimeireservicos.com`).
- **Navegação Limpa:** Acesso ao SIR através de um ícone minimalista e discreto na barra de navegação e menu mobile.
- **Centro de Informações Técnicas:** Consulte o arquivo [`agents.md`](./agents.md) para a documentação técnica completa da arquitetura e diretrizes de desenvolvimento.

---

## 🛠️ Como Executar Localmente

**Pré-requisitos:** Node.js (v18+)

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Configurar variáveis de ambiente:
   Copie `.env.example` para `.env.local` e defina suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Build de produção:
   ```bash
   npm run build
   ```
