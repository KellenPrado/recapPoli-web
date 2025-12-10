import { useMemo } from "react";
import StoryQuiz from "../StoryQuiz";


const generateOptions = (correctValue: number) => {
  const variations = [0.5, 0.75, 1, 1.3];
  const shuffledVariations = variations.sort(() => Math.random() - 0.5);

  return shuffledVariations.map(variation => ({
    value: Math.round(correctValue * variation),
    isCorrect: variation === 1
  }));
};

const QuizMessages = ({ data }: { data?: any }) => {
  if (!data) return null;
  const correctValue = data.interactions.mensagensTrocadas;
  const options = useMemo(() => generateOptions(correctValue), [correctValue]);

  return (
    <StoryQuiz
      question="Quantas mensagens você acredita que enviaram e receberam este ano?"
      options={options}
      successMessage="Parabéns! Você acertou em cheio"
    />
  );
};

export default QuizMessages;
