import { useState, useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const QuizConnectedTime = ({ data }: { data?: any }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!data) return null;

  // Memoize options to prevent re-shuffling on re-render
  const options = useMemo(() => {
    const topUser = { name: data.userLogs?.userName || "Usuário" };

    // Create options: the correct one + 3 fake names
    const fakeNames = ["Beatriz Almeida", "Ricardo Gomes", "Camila Rodrigues", "Bruno Nascimento"];
    const shuffledFakes = fakeNames.sort(() => Math.random() - 0.5).slice(0, 3);

    return [
      { name: topUser.name, isCorrect: true },
      ...shuffledFakes.map(name => ({ name, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);
  }, [data]);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  };

  const isCorrect = selectedIndex !== null && options[selectedIndex]?.isCorrect;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      {/* Question */}
      <div className="animate-fade-up opacity-0">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Quem ficou mais tempo conectado na plataforma?
        </h2>
        <div className="h-1 w-20 bg-gradient-primary mx-auto rounded-full" />
      </div>

      {/* Options */}
      <div className="space-y-3 w-full">
        {options.map((option, index) => {
          let bgClass = "bg-card/80 border-border/50 hover:bg-card";
          let textClass = "text-foreground";

          if (answered) {
            if (index === selectedIndex && !option.isCorrect) {
              bgClass = "bg-destructive/20 border-destructive";
              textClass = "text-destructive";
            } else if (option.isCorrect) {
              bgClass = "bg-green-500/20 border-green-500";
              textClass = "text-green-600";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={answered}
              className={`flex items-center justify-center gap-4 ${bgClass} backdrop-blur-sm rounded-2xl p-4 animate-fade-up opacity-0 border transition-all duration-300 w-full ${answered ? "cursor-default" : "cursor-pointer"}`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`text-lg md:text-xl font-bold ${textClass}`}>
                {option.name}
              </div>
              {answered && option.isCorrect && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {answered && index === selectedIndex && !option.isCorrect && (
                <XCircle className="w-6 h-6 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {/* Result message */}
      {answered && (
        <div
          className="animate-fade-up opacity-0 pt-4"
          style={{ animationDelay: "0.1s" }}
        >
          <p className={`text-lg font-semibold ${isCorrect ? "text-green-600" : "text-destructive"}`}>
            {isCorrect ? "Parabéns! Isso mesmo!" : "Não foi dessa vez :("}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizConnectedTime;
