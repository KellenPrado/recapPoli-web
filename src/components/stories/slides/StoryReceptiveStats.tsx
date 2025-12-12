import { Mic, MessageCircle, MessagesSquare } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import { sortStatsDescending, StatItem } from "@/data/retrospectiveData";

const StoryReceptiveStats = ({ data }: { data?: any }) => {
  if (!data) return null;

  // Use values from data, checking existence just in case
  const chatsIniciadosEmpresa = data.interactions?.chatsIniciadosEmpresa || 0;
  const chatsIniciadosDisparador = data.interactions?.chatsIniciadosDisparador || 0;
  const chatsReceptivos = data.speed?.chatsReceptivos || 0;
  const audiosRecebidos = data.speed?.audiosRecebidos || 0;

  const totalChats = chatsIniciadosEmpresa + chatsReceptivos + chatsIniciadosDisparador;

  const stats: StatItem[] = sortStatsDescending([
    { icon: Mic, label: "Áudios Recebidos", value: audiosRecebidos },
    { icon: MessageCircle, label: "Chats iniciados pelo Cliente (receptivo)", value: chatsReceptivos },
    { icon: MessagesSquare, label: "Total de chats atendidos", value: totalChats },
  ]);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1.5">
      {/* Headline */}
      <div className="animate-fade-up opacity-0">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Seus clientes também falaram muito!
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
        style={{ animationDelay: "0.6s" }}
      >
        <p className="text-lg text-muted-foreground">
          Muita conexão este ano! <span className="text-2xl">💬</span>
        </p>
      </div>
    </div>
  );
};

export default StoryReceptiveStats;
