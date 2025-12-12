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

const QuizMessages = ({ data, id, userId }: { data?: any; id?: number; userId?: number }) => {
  if (!data) return null;
  const correctValue = data.interactions.chatsIniciadosEmpresa;
  const options = useMemo(() => generateOptions(correctValue), [correctValue]);

  return (
    <StoryQuiz
      question="Quantos chats você acredita que a empresa iniciou (conversa ativa) este&nbsp;ano?"
      options={options}
      successMessage="Parabéns! Você acertou em cheio"
      id={id}
      userId={userId}
    />
  );
};

export default QuizMessages;
