import { createClient } from '@supabase/supabase-js';

// 2. Defina as constantes de acesso ao Supabase
// (Ajustei o nome da chave para refletir que é a chave "anon")
const SUPABASE_URL = 'https://ptnldcgmgcilqftamawk.supabase.co';
// **USE SUA CHAVE ANON REAL AQUI (Geralmente começa com eyJ...)**
const SUPABASE_ANON_KEY = 'sb_publishable_-9QTMGtF4Q55ugsJieiamw_0IZBoJt-';

// 3. Inicialize o cliente Supabase fora do componente/hook 
// (Ele será reutilizado em todas as chamadas)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

