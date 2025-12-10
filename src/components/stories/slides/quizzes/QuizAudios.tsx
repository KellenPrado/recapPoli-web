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

const QuizAudios = ({ data }: { data?: any }) => {
  if (!data) return null;
  const correctValue = data.speed.audiosRecebidos;
  const options = useMemo(() => generateOptions(correctValue), [correctValue]);

  return (
    <StoryQuiz
      question="Quantos áudios acreditam ter recebido este ano?"
      options={options}
      successMessage="Parabéns! Mandou bem"
    />
  );
};

export default QuizAudios;
