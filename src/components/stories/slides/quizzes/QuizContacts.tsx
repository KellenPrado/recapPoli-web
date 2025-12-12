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

const QuizContacts = ({ data, id, userId }: { data?: any; id?: number; userId?: number }) => {
  if (!data) return null;
  const correctValue = data.interactions.contatosAtendidos;
  const options = useMemo(() => generateOptions(correctValue), [correctValue]);

  return (
    <StoryQuiz
      question="Quantos contatos você acredita que atenderam este ano?"
      options={options}
      successMessage="Parabéns! Na mosca"
      id={id}
      userId={userId}
    />
  );
};

export default QuizContacts;
