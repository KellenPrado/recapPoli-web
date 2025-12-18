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


  const { data, error } = await supabase
    .from("register")
    .select("views")
    .eq("customer_id", customerId)
    .eq("user_id", userId)
    .maybeSingle();


  const seen = data?.views === true;
  return seen;
}

/* =====================================================
   MARCA COMO VISTO
===================================================== */
async function markAsSeen(customerId: number, userId: number) {


  try {
    const { data, error } = await supabase.from("register").upsert(
      {
        customer_id: customerId,
        user_id: userId,
        created_at: new Date().toISOString(),
      },
      { onConflict: "customer_id,user_id" }
    );

    if (error) {
      // removed console.warn per request
    } else {
      // removed console.log per request
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


  const widget = document.querySelector("recap-poli-widget") as any;
  if (!widget) {
    console.warn("[BACK] Widget not found in DOM");
    return;
  }

  const customerId = Number(widget.getAttribute("customer-id"));
  const userId = Number(widget.getAttribute("user-id"));



  const alreadySeen = await hasSeen(customerId, userId);

  if (alreadySeen) {

    return;
  }



  // 👉 DISPARA O EVENTO CORRETO QUE O COMPONENTE ESCUTA
  window.dispatchEvent(new Event("RECAP_POLI_OPENED"));



  /* =====================================================
   LOG E REGISTRO DE EVENTOS DO WIDGET
===================================================== */
  window.addEventListener("message", async (event) => {
    const data = event.data;

    if (!data) {
      return;
    }

    if (!data.type) {
      return;
    }

    const customerId = data.customerId ?? data.customer_id ?? null;
    const userId = data.userId ?? data.user_id ?? null;



    if (customerId == null || userId == null) {
      return;
    }

    let payload: any = null;

 switch (data.type) {
  case "RETROSPECTIVE_OPENED":
    payload = {
      customer_id: customerId,
      user_id: userId,
      created_at: data.openedAt || new Date().toISOString(),
      quiz_chats: null,
      quiz_activeMsg: null,
      feedback: null,
    };
    break;

  case "RETROSPECTIVE_QUIZ_ANSWER":
    payload = {
      customer_id: customerId,
      user_id: userId,
      created_at: data.answeredAt || new Date().toISOString(),
      quiz_chats: true,
      quiz_activeMsg: !!data.quizActive,
      feedback: null,
    };
    break;

  case "RETROSPECTIVE_FEEDBACK_VIEW":
    payload = {
      customer_id: customerId,
      user_id: userId,
      views: true,
      // feedback continua null
    };
    break;

  case "RETROSPECTIVE_FEEDBACK":
    payload = {
      customer_id: customerId,
      user_id: userId,
      created_at: data.feedbackAt || new Date().toISOString(),
      feedback: data.liked === true ? true : false,
    };
    break;

  default:
    return;
}


    try {
      const { error } = await supabase.from("register").upsert([payload]);

      if (error) {
        console.error("[BACK][supabase] erro ao inserir", error);
      } else {

      }
    } catch (err) {
      console.error("[BACK][supabase] erro inesperado", err);
    }
  });

});