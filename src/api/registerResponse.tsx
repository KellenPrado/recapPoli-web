import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://ptnldcgmgcilqftamawk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_-9QTMGtF4Q55ugsJieiamw_0IZBoJt-';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.addEventListener('message', async (event) => {
  // Apenas processe mensagens da origem esperada por segurança, se possível
  // if (event.origin !== 'URL_DA_ORIGEM') return;

  const data = event.data;

  // Verifique se os dados contêm um campo 'type'
  if (!data || !data.type) {
    return;
  }

  let dataToInsert = null;

  // Normalize common ids (support both snake_case and camelCase)
  const customerId = data.customerId ?? data.customer_id ?? null;
  const userId = data.userId ?? data.user_id ?? null;

  switch (data.type) {
    case "RETROSPECTIVE_OPENED":
      dataToInsert = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.openedAt || new Date().toISOString(),
        quiz_chats: false,
        quiz_activeMsg: false,
        feedback: false,
      };
      break;
    case "RETROSPECTIVE_QUIZ_ANSWER":
      dataToInsert = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.answeredAt || new Date().toISOString(),
        quiz_chats: true,
        quiz_activeMsg: !!data.quizActive || true,
        feedback: false,
        quiz_data: data.quizData || data.payload || null,
      };
      break;
    case "RETROSPECTIVE_FEEDBACK":
      dataToInsert = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.feedbackAt || new Date().toISOString(),
        quiz_chats: false,
        quiz_activeMsg: false,
        feedback: true,
        feedback_text: data.feedbackText || data.payload || null,
      };
      break;
    default:
      return;
  }

  // --- Realizar a Inserção no Supabase ---
  if (dataToInsert) {
    console.log(`Inserindo dados do tipo ${data.type} no Supabase:`, dataToInsert);
    try {
      const { data: inserted, error } = await supabase
        .from('views')
        .insert([dataToInsert])
        .select();

      if (error) {
        console.error('Erro ao inserir no Supabase:', error);
      } else {
        console.log('Inserção bem-sucedida:', inserted);
      }
    } catch (err) {
      console.error('Erro inesperado ao inserir no Supabase:', err);
    }
  }
});