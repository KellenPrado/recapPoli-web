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
  console.log ("identificação recap",customerId, userId);
if (customerId == null || userId == null) return false;

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
  const widget = document.querySelector("recap-poli-widget") as any;
  if (!widget) {
    console.warn("[WIDGET] Widget não encontrado");
    return;
  }

  const customerId = Number(widget.getAttribute("customer-id"));
  const userId = Number(widget.getAttribute("user-id"));

  console.log("[WIDGET] Verificando se já foi visto:", { customerId, userId });

  const alreadySeen = await hasSeen(customerId, userId);

  if (alreadySeen) {
    console.log("[WIDGET] Usuário já viu — não abrindo");
    return;
  }

  console.log("[WIDGET] Primeira visualização — abrindo widget");

  // 👉 DISPARA O EVENTO CORRETO QUE O COMPONENTE ESCUTA
  window.dispatchEvent(new Event("RECAP_POLI_OPENED"));
  console.log("[WIDGET] Evento RECAP_POLI_OPENED disparado");

  // 👉 MARCA COMO VISTO
  await markAsSeen(customerId, userId);
  console.log("[WIDGET] Marcado como visto no banco");
});