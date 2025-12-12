import { useState, useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const QuizTopCollaborator = ({ data, id, userId }: { data?: any; id?: number; userId?: number }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  if (!data) return null;

  // Memoize options to prevent re-shuffling on re-render
  const options = useMemo(() => {
    const topCollaborator = { name: data.ranking?.userName || "Usuário" };

    // Create options: the correct one + 3 fake names
    const fakeNames = ["Mariana Oliveira", "Pedro Santos", "Lucas Ferreira", "Fernanda Lima"];
    const shuffledFakes = fakeNames.sort(() => Math.random() - 0.5).slice(0, 3);

    return [
      { name: topCollaborator.name, isCorrect: true },
      ...shuffledFakes.map(name => ({ name, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);
  }, [data]);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);

    const option = options[index];
    const answeredAt = new Date().toISOString();
    const isCorrectAnswer = !!option?.isCorrect;

    // Post answer to parent window - send true/false as answer
    window.parent.postMessage(
      {
        type: "RETROSPECTIVE_QUIZ_ANSWER",
        customerId: id,
        userId: userId,
        question: "Quem atendeu mais chats este ano?",
        selectedValue: option?.name,
        isCorrect: isCorrectAnswer,
        answer: isCorrectAnswer,
        answeredAt,
      },
      "*"
    );

    // Store last answer on global for quick retrieval
    (window as any).RecapPoli = (window as any).RecapPoli || {};
    (window as any).RecapPoli.lastQuizAnswer = {
      isCorrect: isCorrectAnswer,
      answeredAt,
      question: "Quem atendeu mais chats este ano?",
      selectedValue: option?.name,
    };
  };

  const isCorrect = selectedIndex !== null && options[selectedIndex]?.isCorrect;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 w-full max-w-2xl">
      {/* Question */}
      <div className="animate-fade-up opacity-0 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          Quem atendeu mais chats este ano?
        </h2>
        <div className="h-1 w-20 bg-gradient-primary rounded-full mx-auto mb-4" />
        <p className="text-sm md:text-base font-medium text-red-500">
          Escolha apenas uma das opções abaixo
        </p>
      </div>

      {/* Radio Options */}
      <div className="space-y-3 w-full">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrectOption = option.isCorrect;
          
          let bgClass = "bg-card/60 border-border/50 hover:bg-card/80";
          let borderClass = "border-2";
          let textClass = "text-foreground";

          if (answered) {
            if (isSelected && !isCorrectOption) {
              bgClass = "bg-destructive/20";
              borderClass = "border-2 border-destructive";
              textClass = "text-destructive";
            } else if (isCorrectOption) {
              bgClass = "bg-green-500/20";
              borderClass = "border-2 border-green-500";
              textClass = "text-green-600";
            } else {
              bgClass = "bg-card/30";
              borderClass = "border-2 border-border/30";
            }
          } else if (isSelected) {
            bgClass = "bg-primary/20";
            borderClass = "border-2 border-primary";
          }

          return (
            <label
              key={index}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 animate-fade-up opacity-0 ${bgClass} ${borderClass} ${answered ? "cursor-default" : "hover:shadow-md"} w-full`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Name */}
              <div className={`text-lg md:text-xl font-bold ${textClass}`}>
                {option.name}
              </div>

              {/* Radio Button and Icons Row */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? answered && isCorrectOption
                        ? "border-green-500 bg-green-500"
                        : answered && !isCorrectOption
                        ? "border-destructive bg-destructive"
                        : "border-primary bg-primary"
                      : "border-border/50 bg-transparent"
                  }`}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>

                {/* Feedback Icons */}
                {answered && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {answered && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>

              {/* Hidden input for accessibility */}
              <input
                type="radio"
                name="quiz-option"
                checked={isSelected}
                onChange={() => handleSelect(index)}
                disabled={answered}
                className="hidden"
              />
            </label>
          );
        })}
      </div>

      {/* Result message */}
      {answered && (
        <div
          className="animate-fade-up opacity-0 pt-4 w-full"
          style={{ animationDelay: "0.1s" }}
        >
          <p className={`text-lg font-semibold text-center ${isCorrect ? "text-green-600" : "text-destructive"}`}>
            {isCorrect ? "Parabéns! Acertou em cheio" : "Não foi dessa vez :("}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizTopCollaborator;
