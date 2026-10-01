/**
 * Supabase Client & Data Synchronization Layer
 * Ecossistema Central SIR — Rosimeire Serviços (Algarve, Portugal)
 * Versão: 3.0-supabase
 */
import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl = rawUrl.replace(/\.supabase\.com/i, '.supabase.co');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http')
);

// Fallback client to prevent application crash if credentials are not filled yet
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'
);

let activeSchema = 'WEBSITE';

export interface SupabaseDiagnostic {
  isConfigured: boolean;
  url: string;
  hasAnonKey: boolean;
  status: 'connected' | 'not_configured' | 'error';
  detectedSchema?: string;
  message: string;
  rawError?: any;
}

/**
 * Executa diagnóstico completo e identifica o schema correto
 */
export async function diagnoseSupabaseConnection(): Promise<SupabaseDiagnostic> {
  if (!isSupabaseConfigured) {
    return {
      isConfigured: false,
      url: supabaseUrl,
      hasAnonKey: Boolean(supabaseAnonKey),
      status: 'not_configured',
      message: 'Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não estão preenchidas no .env.local.'
    };
  }

  // 1. Tentar schema WEBSITE
  try {
    const res1 = await supabase
      .schema('WEBSITE')
      .from('database')
      .select('*')
      .eq('id', 1)
      .single();

    if (!res1.error && res1.data) {
      activeSchema = 'WEBSITE';
      return {
        isConfigured: true,
        url: supabaseUrl,
        hasAnonKey: true,
        status: 'connected',
        detectedSchema: 'WEBSITE',
        message: 'Conectado com sucesso ao schema WEBSITE.database (id: 1).'
      };
    }

    if (res1.error?.code === 'PGRST116') {
      activeSchema = 'WEBSITE';
      return {
        isConfigured: true,
        url: supabaseUrl,
        hasAnonKey: true,
        status: 'error',
        detectedSchema: 'WEBSITE',
        message: 'A tabela WEBSITE.database existe, mas está vazia (falta registro com id = 1).',
        rawError: res1.error
      };
    }

    // 2. Tentar schema website (minúsculo) caso não tenha sido criado com aspas duplas
    const res2 = await supabase
      .schema('website')
      .from('database')
      .select('*')
      .eq('id', 1)
      .single();

    if (!res2.error && res2.data) {
      activeSchema = 'website';
      return {
        isConfigured: true,
        url: supabaseUrl,
        hasAnonKey: true,
        status: 'connected',
        detectedSchema: 'website',
        message: 'Conectado com sucesso ao schema website.database (minúsculo).'
      };
    }

    // 3. Tentar schema public
    const res3 = await supabase
      .from('database')
      .select('*')
      .eq('id', 1)
      .single();

    if (!res3.error && res3.data) {
      activeSchema = 'public';
      return {
        isConfigured: true,
        url: supabaseUrl,
        hasAnonKey: true,
        status: 'connected',
        detectedSchema: 'public',
        message: 'Conectado com sucesso à tabela public.database.'
      };
    }

    const finalErr = res1.error || res2.error || res3.error;
    let explanation = finalErr?.message || 'Erro desconhecido ao consultar Supabase';
    
    if (finalErr?.code === 'PGRST106') {
      explanation = `O schema 'WEBSITE' não está exposto no PostgREST. Acesse o painel do Supabase -> Project Settings -> API -> Data API -> Exposed schemas e adicione 'WEBSITE'.`;
    } else if (finalErr?.code === '42501' || finalErr?.message?.includes('permission denied')) {
      explanation = `Permissão negada por RLS (Row Level Security). Crie uma política de SELECT para a role 'anon' na tabela 'database'.`;
    } else if (finalErr?.message?.includes('relation') || finalErr?.message?.includes('does not exist')) {
      explanation = `A tabela 'database' não foi encontrada no banco. Verifique se o schema e a tabela foram criados.`;
    }

    return {
      isConfigured: true,
      url: supabaseUrl,
      hasAnonKey: true,
      status: 'error',
      message: `Erro [${finalErr?.code || 'REST'}]: ${explanation}`,
      rawError: finalErr
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      url: supabaseUrl,
      hasAnonKey: true,
      status: 'error',
      message: `Exceção de rede: ${err?.message || err}`,
      rawError: err
    };
  }
}

/**
 * Lê os dados da tabela database (com suporte a fallback de schema)
 */
export async function fetchWebsiteDatabase() {
  if (!isSupabaseConfigured) {
    return null;
  }

  // Tentativa primária no schema WEBSITE
  let response = await supabase
    .schema('WEBSITE')
    .from('database')
    .select('*')
    .eq('id', 1)
    .single();

  if (response.data) {
    activeSchema = 'WEBSITE';
    return response.data;
  }

  // Fallbacks automáticos se o schema for minúsculo ou public
  if (response.error && (response.error.code === 'PGRST106' || response.error.message?.includes('schema'))) {
    const resLower = await supabase
      .schema('website')
      .from('database')
      .select('*')
      .eq('id', 1)
      .single();

    if (resLower.data) {
      activeSchema = 'website';
      return resLower.data;
    }

    const resPublic = await supabase
      .from('database')
      .select('*')
      .eq('id', 1)
      .single();

    if (resPublic.data) {
      activeSchema = 'public';
      return resPublic.data;
    }
  }

  if (response.error) {
    console.warn('[Supabase] Aviso ao buscar dados:', response.error.message);
    throw response.error;
  }

  return response.data;
}

/**
 * Atualiza os dados da tabela database
 */
export async function updateWebsiteDatabase(payload: Record<string, any>) {
  if (!isSupabaseConfigured) {
    return false;
  }

  const client = activeSchema === 'public' 
    ? supabase.from('database') 
    : supabase.schema(activeSchema as any).from('database');

  const { error } = await client
    .update({
      ...payload,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1);

  if (error) {
    console.error('[Supabase] Erro ao atualizar tabela database:', error);
    throw error;
  }

  return true;
}

/**
 * Insere um novo registo em contact_submissions
 */
export async function insertContactSubmission(submission: {
  nome: string;
  email: string;
  telefone: string;
  ddi: string;
  mensagem: string;
}) {
  if (!isSupabaseConfigured) {
    console.info('[Supabase] Simulação local de envio:', submission);
    return { success: true, simulated: true };
  }

  const client = activeSchema === 'public'
    ? supabase.from('contact_submissions')
    : supabase.schema(activeSchema as any).from('contact_submissions');

  const { data, error } = await client.insert([submission]);

  if (error) {
    console.error('[Supabase] Erro ao inserir contact_submissions:', error);
    throw error;
  }

  return { success: true, data };
}
