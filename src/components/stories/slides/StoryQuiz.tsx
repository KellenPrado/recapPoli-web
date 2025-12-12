import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";

interface QuizOption {
  value: number;
  isCorrect: boolean;
}

interface StoryQuizProps {
  question: string;
  options: QuizOption[];
  successMessage: string;
  failMessage?: string;
  id?: number;
  userId?: number;
}

const StoryQuiz = ({ question, options, successMessage, failMessage = "Não foi dessa vez :(", id, userId }: StoryQuizProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

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
        question,
        selectedValue: option?.value,
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
      question,
      selectedValue: option?.value,
    };
  };

  const isCorrect = selectedIndex !== null && options[selectedIndex]?.isCorrect;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 md:space-y-3 w-full max-w-2xl">
      {/* Question */}
      <div className="animate-fade-up opacity-0 w-full">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 break-words whitespace-pre-line max-w-2xl mx-auto">
          {question}
        </h2>
        <div className="h-1 w-20 bg-gradient-primary rounded-full mx-auto mb-4" />
        <p className="text-sm md:text-base font-medium text-red-500">
          Escolha apenas uma das opções abaixo
        </p>
      </div>

      {/* Radio Options */}
      <div className="space-y-1.5 w-full">
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
              className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-300 animate-fade-up opacity-0 ${bgClass} ${borderClass} ${answered ? "cursor-default" : "hover:shadow-md"} w-full`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              {/* Radio Button */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
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

              {/* Value - Left Aligned */}
              <div className={`text-lg md:text-xl font-bold ${textClass}`}>
                <AnimatedNumber value={option.value} delay={300 + index * 100} />
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
            {isCorrect ? successMessage : failMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryQuiz;
