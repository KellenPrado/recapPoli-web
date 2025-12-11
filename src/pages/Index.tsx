import { Helmet } from "react-helmet-async";
import StoryContainer from "@/components/stories/StoryContainer";

interface IndexProps {
  id?: number;
  userId?: number;
}

const Index = ({ id, userId }: IndexProps) => {
  return (
    <>
      <Helmet>
        <title>Retrospectiva 2025 - Sua Jornada em Números</title>
        <meta
          name="description"
          content="Descubra sua retrospectiva de 2025. Veja todas as interações e conquistas do ano em uma experiência imersiva estilo Stories."
        />
      </Helmet>
      <main className="w-full h-screen overflow-hidden bg-background">
        <StoryContainer id={id} userId={userId} />
      </main>
    </>
  );
};

export default Index;

