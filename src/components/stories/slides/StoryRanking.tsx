import { Crown, Medal, Award, User, Calendar, TrendingUp } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";

const StoryRanking = ({ data }: { data?: any }) => {
  if (!data) return null;

  // Adapt single user ranking to list format expected by UI
  const topCollaborators = [
    {
      name: data.userYourself?.userName || "Usuário",
      totalChats: data.userYourself?.userChats || 0,
      avgPerMonth: data.userYourself?.userMedia || 0,
      position: 1
    }
  ];

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-coral" />;
      case 2:
        return <Medal className="w-5 h-5 text-primary" />;
      case 3:
        return <Award className="w-5 h-5 text-primary" />;
      default:
        return null;
    }
  };

  const getPositionStyle = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-coral text-primary-foreground ring-2 ring-coral/50";
      case 2:
        return "bg-card text-foreground border border-border";
      case 3:
        return "bg-card/80 text-foreground border border-border/50";
      default:
        return "bg-card";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1.5">
      {/* Icon */}
      <div className="animate-fade-up opacity-0">
        <div className="relative">
          <div className="absolute inset-0 bg-coral rounded-full blur-xl opacity-40 animate-pulse-glow-coral" />
          <div className="relative bg-gradient-coral p-3 rounded-full">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="animate-fade-up opacity-0 stagger-2">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Você fez história!
        </h2>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-muted-foreground animate-fade-up opacity-0 stagger-3">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Total no ano</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>Média/mês</span>
        </div>
      </div>

      {/* Ranking */}
      <div className="space-y-1.5 w-full">
        {topCollaborators.map((collab, index) => (
          <div
            key={collab.name}
            className={`flex items-center gap-3 rounded-2xl p-3 animate-fade-up opacity-0 ${getPositionStyle(
              collab.position
            )}`}
            style={{ animationDelay: `${0.3 + index * 0.15}s` }}
          >
            {/* Position indicator */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
              {getPositionIcon(collab.position)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>

            {/* Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="font-bold text-lg truncate">{collab.name}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <AnimatedNumber value={collab.totalChats} delay={400 + index * 150} /> chats
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <AnimatedNumber value={collab.avgPerMonth} delay={500 + index * 150} />/mês
                </span>
              </div>
            </div>

            {/* Position badge */}
            <div className="text-2xl font-bold shrink-0">#{collab.position}</div>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div
        className="animate-fade-up opacity-0 pt-2"
        style={{ animationDelay: "0.8s" }}
      >
        <p className="text-lg text-muted-foreground">
          Você carregou a coroa do atendimento{" "}
          <span className="text-2xl">👑</span>
        </p>
      </div>
    </div>
  );
};

export default StoryRanking;