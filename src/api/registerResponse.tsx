import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = "https://ptnldcgmgcilqftamawk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_-9QTMGtF4Q55ugsJieiamw_0IZBoJt-";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* =====================================================
   VERIFICA SE JÁ FOI VISTO
===================================================== */
export async function hasSeen(
  customerId: number | null,
  userId: number | null
): Promise<boolean> {
  console.log("[BACK] hasSeen: start - checking Supabase for view flag", {
    customerId,
    userId,
  });

  if (customerId == null || userId == null) {
    console.log("[BACK] hasSeen: missing ids, treating as not seen");
    return false;
  }

  const { data, error } = await supabase
    .from("register")
    .select("views")
    .eq("customer_id", customerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[BACK] hasSeen: supabase error", error);
    return false;
  }

  console.log("[BACK] hasSeen: query result", { data });

  const seen = data?.views === true;
  console.log("[BACK] hasSeen: computed seen =>", seen);
  return seen;
}

/* =====================================================
   MARCA COMO VISTO
===================================================== */
async function markAsSeen(customerId: number, userId: number) {
  console.log("[BACK] markAsSeen: upserting record to mark as seen", {
    customerId,
    userId,
  });

  try {
    const { data, error } = await supabase.from("register").upsert(
      {
        customer_id: customerId,
        user_id: userId,
        views: true,
        created_at: new Date().toISOString(),
      },
      { onConflict: "customer_id,user_id" }
    );

    if (error) {
      console.warn("[BACK] markAsSeen: supabase upsert error", error);
    } else {
      console.log("[BACK] markAsSeen: upsert success", { data });
    }
  } catch (err) {
    console.error("[BACK] markAsSeen: unexpected error", err);
  }
}

/* =====================================================
   CONTROLE DE ABERTURA DO WIDGET
===================================================== */
window.addEventListener("RECAP_POLI_REQUEST_OPEN", async (ev: Event) => {
  const detail = (ev as CustomEvent)?.detail;
  console.log("[BACK] RECAP_POLI_REQUEST_OPEN received", { detail });

  const widget = document.querySelector("recap-poli-widget") as any;
  if (!widget) {
    console.warn("[BACK] Widget not found in DOM");
    return;
  }

  const customerId = Number(widget.getAttribute("customer-id"));
  const userId = Number(widget.getAttribute("user-id"));

  console.log("[BACK] Verificando se já foi visto:", { customerId, userId });

  const alreadySeen = await hasSeen(customerId, userId);

  if (alreadySeen) {
    console.log("[BACK] decision: already seen => no open");
    return;
  }

  console.log("[BACK] decision: not seen => will open widget now");

  // 👉 DISPARA O EVENTO CORRETO QUE O COMPONENTE ESCUTA
  window.dispatchEvent(new Event("RECAP_POLI_OPENED"));
  console.log("[BACK] Evento RECAP_POLI_OPENED disparado");

  // 👉 MARCA COMO VISTO
  await markAsSeen(customerId, userId);
  console.log("[BACK] Marcado como visto no banco");

  /* =====================================================
   LOG E REGISTRO DE EVENTOS DO WIDGET
===================================================== */
window.addEventListener("message", async (event) => {
  const data = event.data;

  if (!data) {
    console.warn("[BACK][message] data vazia");
    return;
  }

  if (!data.type) {
    console.warn("[BACK][message] sem type, ignorando", data);
    return;
  }

  const customerId = data.customerId ?? data.customer_id ?? null;
  const userId = data.userId ?? data.user_id ?? null;

  console.log("[BACK][message] ids normalizados", {
    customerId,
    userId,
  });

  if (customerId == null || userId == null) {
    console.warn("[BACK][message] ids inválidos, abortando");
    return;
  }

  let payload: any = null;

  switch (data.type) {
    case "RETROSPECTIVE_OPENED":
      console.log("[BACK][message] evento OPENED");
      payload = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.openedAt || new Date().toISOString(),
        quiz_chats: false,
        quiz_activeMsg: false,
        feedback: false,
        
      };
      break;

    case "RETROSPECTIVE_QUIZ_ANSWER":
      console.log("[BACK][message] evento QUIZ_ANSWER", data);
      payload = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.answeredAt || new Date().toISOString(),
        quiz_chats: true,
        quiz_activeMsg: !!data.quizActive,
        feedback: false,
      };
      break;

    case "RETROSPECTIVE_FEEDBACK":
      console.log("[BACK][message] evento FEEDBACK", data);
      payload = {
        customer_id: customerId,
        user_id: userId,
        created_at: data.feedbackAt || new Date().toISOString(),
        quiz_chats: false,
        quiz_activeMsg: false,
        feedback: true,
      };
      break;

    default:
      console.warn("[BACK][message] tipo desconhecido", data.type);
      return;
  }

  console.log("[BACK][message] payload final", payload);

  try {
    console.log("[BACK][supabase] inserindo evento");
    const { error } = await supabase.from("register").upsert([payload]);

    if (error) {
      console.error("[BACK][supabase] erro ao inserir", error);
    } else {
      console.log("[BACK][supabase] evento inserido com sucesso");
    }
  } catch (err) {
    console.error("[BACK][supabase] erro inesperado", err);
  }
});

});