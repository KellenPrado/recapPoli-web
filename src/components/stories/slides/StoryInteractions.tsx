import { MessageCircle, Mic, Users, MessagesSquare, Send } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import { sortStatsDescending, StatItem } from "@/data/retrospectiveData";

const StoryInteractions = ({ data }: { data?: any }) => {
  if (!data) return null;

  const stats: StatItem[] = sortStatsDescending([
    { icon: MessageCircle, label: "Mensagens Trocadas", value: data.interactions.mensagensTrocadas },
    { icon: Mic, label: "Áudios Enviados", value: data.interactions.audiosEnviados },
    //    { icon: MessagesSquare, label: "Chats iniciados pela Empresa (ativos)", value: data.interactions.chatsIniciadosEmpresa },
    { icon: Users, label: "Contatos Atendidos", value: data.interactions.contatosAtendidos },
    { icon: Send, label: "Chats iniciados pelo Disparador", value: data.interactions.chatsIniciadosDisparador },
  ]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
      {/* Headline */}
      <div className="animate-fade-up opacity-0">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Quando a conversa flui…
        </h2>
        <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full" />
      </div>

      {/* Stats */}
      <div className="space-y-1.5 w-full">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-2xl p-3 animate-fade-up opacity-0 border border-border/50"
            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
          >
            <div className="bg-gradient-primary p-2 rounded-xl shrink-0">
              <stat.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-xl md:text-2xl font-bold text-foreground">
                <AnimatedNumber value={stat.value} delay={300 + index * 100} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div
        className="animate-fade-up opacity-0 pt-4"
        style={{ animationDelay: "0.8s" }}
      >
        <p className="text-lg text-muted-foreground">
          E tudo isso só em 2025. <span className="text-2xl">🤯</span>
        </p>
      </div>
    </div>
  );
};

export default StoryInteractions;
