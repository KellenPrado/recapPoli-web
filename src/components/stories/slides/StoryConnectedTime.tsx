import { Clock } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";

const StoryConnectedTime = ({ data }: { data?: any }) => {
  if (!data) return null;

  // Adapt single user logs to list format expected by UI
  const rankedUsers = [
    {
      name: data.userLogs?.userName || "Usuário",
      totalHours: data.userLogs?.userLogs || 0,
      avgPerMonth: 0, // Not provided by API
      position: 1
    }
  ];

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-primary";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Clock className="w-10 h-10 text-accent" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          Eles bateram o record de tempo de conexão!
        </h2>
      </div>

      <div className="w-full space-y-4 mb-8">
        {rankedUsers.map((user, index) => (
          <div
            key={user.name}
            className="bg-card/50 rounded-xl p-4 border border-border/30 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className={`text-3xl font-bold ${getMedalColor(user.position)}`}>
                {user.position}º
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-primary text-lg">
                  {user.name}
                </div>
                <div className="text-primary text-sm">
                  <AnimatedNumber value={user.totalHours} /> horas no total
                </div>
                <div className="text-primary text-sm">
                  <AnimatedNumber value={user.avgPerMonth} /> horas/mês
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-primary text-base md:text-lg font-medium">
        Quando o assunto é tempo conectado, eles são referência
      </p>
    </div>
  );
};

export default StoryConnectedTime;
