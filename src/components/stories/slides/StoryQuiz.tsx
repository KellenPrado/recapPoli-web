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
}

const StoryQuiz = ({ question, options, successMessage, failMessage = "Não foi dessa vez :(" }: StoryQuizProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  };

  const isCorrect = selectedIndex !== null && options[selectedIndex]?.isCorrect;
  const correctIndex = options.findIndex(opt => opt.isCorrect);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
      {/* Question */}
      <div className="animate-fade-up opacity-0">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {question}
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
              className={`flex items-center justify-center gap-4 ${bgClass} backdrop-blur-sm rounded-2xl p-3 animate-fade-up opacity-0 border transition-all duration-300 w-full ${answered ? "cursor-default" : "cursor-pointer"}`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`text-xl md:text-2xl font-bold ${textClass}`}>
                <AnimatedNumber value={option.value} delay={300 + index * 100} />
              </div>
              {answered && option.isCorrect && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {answered && index === selectedIndex && !option.isCorrect && (
                <XCircle className="w-5 h-5 text-destructive" />
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
            {isCorrect ? successMessage : failMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryQuiz;
