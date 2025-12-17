import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface StoryFeedbackProps {
  id?: number;
  userId?: number;
}

// 👉 Envia resposta do feedback (somente no clique)
const saveFeedback = (liked: boolean, id?: number, userId?: number) => {
  const feedbackAt = new Date().toISOString();

  window.parent.postMessage(
    {
      type: "RETROSPECTIVE_FEEDBACK",
      liked,
      customerId: id,
      userId: userId,
      feedbackAt,
    },
    "*",
  );

};

const StoryFeedback = ({ id, userId }: StoryFeedbackProps) => {
  const [selected, setSelected] = useState<"up" | "down" | null>(null);

  // 👉 DISPARA ASSIM QUE A TELA DE FEEDBACK APARECE
  useEffect(() => {
    const viewedAt = new Date().toISOString();

    window.parent.postMessage(
      {
        type: "RETROSPECTIVE_FEEDBACK_VIEW",
        customerId: id,
        userId: userId,
        viewedAt,
      },
      "*",
    );

  }, [id, userId]);

  const handleSelect = (choice: "up" | "down") => {
    if (selected) return;

    setSelected(choice);
    saveFeedback(choice === "up", id, userId);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-10">
      {/* Pergunta */}
      <div className="animate-fade-up opacity-0">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Gostou de como apresentamos
          <span className="text-gradient-coral"> o resumo do seu ano?</span>
        </h2>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-center gap-8 animate-fade-up opacity-0 stagger-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSelect("up");
          }}
          disabled={selected !== null}
          className={`p-6 rounded-full transition-all duration-300 ${
            selected === "up"
              ? "bg-green-500 scale-110 shadow-lg shadow-green-500/30"
              : selected === "down"
              ? "bg-card/30 opacity-50"
              : "bg-card/80 hover:bg-primary/20 hover:scale-105"
          } border border-border/50`}
        >
          <ThumbsUp className={`w-12 h-12 ${selected === "up" ? "text-white" : "text-foreground"}`} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSelect("down");
          }}
          disabled={selected !== null}
          className={`p-6 rounded-full transition-all duration-300 ${
            selected === "down"
              ? "bg-coral scale-110 shadow-lg shadow-coral/30"
              : selected === "up"
              ? "bg-card/30 opacity-50"
              : "bg-card/80 hover:bg-coral/20 hover:scale-105"
          } border border-border/50`}
        >
          <ThumbsDown className={`w-12 h-12 ${selected === "down" ? "text-white" : "text-foreground"}`} />
        </button>
      </div>

      {/* Mensagem */}
      {selected && (
        <div className="animate-fade-up">
          <p className="text-xl font-semibold text-muted-foreground">
            {selected === "up" ? "Obrigado pelo feedback! 💙" : "Agradecemos sua opinião!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryFeedback;
