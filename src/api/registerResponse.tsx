import { createClient } from "@supabase/supabase-js";

const URL_DA_ORIGEM_CONFIAVEL = "http://localhost:8080";
const ORIGEM_CONFIAVEL = URL_DA_ORIGEM_CONFIAVEL.replace(/\/$/, "");

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
  if (!customerId || !userId) return false;

  const { data, error } = await supabase
    .from("register")
    .select("views")
    .eq("customer_id", customerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[SUPABASE] hasSeen erro:", error);
    return false;
  }

  return data?.views === true;
}

/* =====================================================
   MARCA COMO VISTO
===================================================== */
async function markAsSeen(customerId: number, userId: number) {
  await supabase.from("register").upsert(
    {
      customer_id: customerId,
      user_id: userId,
      views: true,
      created_at: new Date().toISOString(),
    },
    { onConflict: "customer_id,user_id" }
  );
}

/* =====================================================
   CONTROLE DE ABERTURA DO WIDGET
===================================================== */
window.addEventListener("RECAP_POLI_REQUEST_OPEN", async () => {
  const widget = document.querySelector("recap-poli-widget");
  if (!widget) return;

  const customerId = Number(widget.getAttribute("customer-id"));
  const userId = Number(widget.getAttribute("user-id"));

  const alreadySeen = await hasSeen(customerId, userId);


  // Marca como visto imediatamente após abrir
  await markAsSeen(customerId, userId);
});

/* =====================================================
   BLOQUEIA MENSAGENS EXTERNAS NÃO CONFIÁVEIS
===================================================== */
window.addEventListener("message", (event) => {
  if (event.origin !== ORIGEM_CONFIAVEL) return;
});
