import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchEmpresaData from "@/api/useFetchEmpresaData";
import StoryProgress from "./StoryProgress";
import StoryOpening from "./slides/StoryOpening";
import StoryInteractions from "./slides/StoryInteractions";
import StoryRanking from "./slides/StoryRanking";
import StoryConnectedTime from "./slides/StoryConnectedTime";
import StoryClosing from "./slides/StoryClosing";
import StoryReceptiveStats from "./slides/StoryReceptiveStats";
import QuizMessages from "./slides/quizzes/QuizMessages";
import QuizContacts from "./slides/quizzes/QuizContacts";
import QuizAudios from "./slides/quizzes/QuizAudios";
import QuizTopCollaborator from "./slides/quizzes/QuizTopCollaborator";
import QuizConnectedTime from "./slides/quizzes/QuizConnectedTime";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import logoImg from "@/assets/logo-poli.png"
import useFetchUserData from "@/api/useFetchUsersData";

const closeWidget = () => {
  // Send message to parent window to close the widget
  window.parent.postMessage({ type: "CLOSE_RETROSPECTIVE" }, "*");
};

const STORY_DURATION = 15000; // 15 seconds per story

const stories = [
  StoryOpening,         // 1 - Abertura
  StoryInteractions,    // 2 - Interações
//QuizContacts,         // 4 - Quiz: Contatos
  StoryReceptiveStats,  // 6 - Stats Receptivos
  //QuizTopCollaborator,  // 7 - Quiz: Top Colaborador
  QuizAudios,           // 5 - Quiz: chats do usuário
  StoryRanking,         // 8 - Top Colaboradores
  // QuizConnectedTime,    // 9 - Quiz: Tempo Conectado
  // StoryConnectedTime,   // 10 - Tempo Conectado
  QuizMessages,         // 3 - Quiz: mensangens enviadas
  StoryClosing,         // 11 - Encerramento
];

const StoryContainer = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("id") ? parseInt(searchParams.get("id")!) : undefined;
  // Pega o userId da URL ou usa undefined para ativar o default do hook
  const userId = searchParams.get("userId") ? parseInt(searchParams.get("userId")!) : undefined;

  const { clientData, loading, error } = useFetchEmpresaData(customerId);
  // Usa o userId aqui, não o customerId
  const { clientData: userData, loading: userLoading, error: userError } = useFetchUserData(userId);


  const goToNext = useCallback(() => {
    if (currentStory < stories.length - 1) {
      setCurrentStory((prev) => prev + 1);
    } else {
      // Auto-close when last story ends
      closeWidget();
    }
  }, [currentStory]);

  const goToPrev = useCallback(() => {
    if (currentStory > 0) {
      setCurrentStory((prev) => prev - 1);
    }
  }, [currentStory]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      goToPrev();
    } else if (x > (width * 2) / 3) {
      goToNext();
    } else {
      setIsPaused((prev) => !prev);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    setTouchStart(null);
    setIsPaused(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === " ") setIsPaused((prev) => !prev);
    },
    [goToNext, goToPrev]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const CurrentStoryComponent = stories[currentStory];

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Background gradient based on story */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%)`,
        }}
      />

      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          closeWidget();
        }}
        className="absolute top-4 right-4 z-30 p-2 rounded-full bg-card/80 hover:bg-card transition-colors"
        aria-label="Fechar"
      >
        <X className="w-5 h-5 text-foreground" />
      </button>

      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <StoryProgress
          totalStories={stories.length}
          currentStory={currentStory}
          isPaused={isPaused}
          duration={STORY_DURATION}
          onComplete={goToNext}
        />
      </div>

      {/* Story content */}
      <div
        className="relative h-full flex items-center justify-center cursor-pointer select-none"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-lg mx-auto px-6 py-20">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            (clientData || userData) && (
              <CurrentStoryComponent
                key={currentStory}
                data={
                  [QuizAudios, StoryRanking, StoryConnectedTime, QuizTopCollaborator, QuizConnectedTime].includes(CurrentStoryComponent)
                    ? userData
                    : clientData
                }
              />
            )
          )}
        </div>
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex absolute inset-y-0 left-4 items-center z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
          }}
          disabled={currentStory === 0}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-6 h-6 text-foreground" />
        </button>
      </div>

      <div className="hidden md:flex absolute inset-y-0 right-4 items-center z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          disabled={currentStory === stories.length - 1}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Logo */}
      <div className="absolute bottom-16 md:bottom-14 left-1/2 -translate-x-1/2 z-20">
        <img
          src={logoImg}
          alt="Poli"
          className="h-8 md:h-10 w-auto opacity-80"
        />
      </div>

      {/* Story indicator */}
      <div className="absolute bottom-6 md:bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground text-sm z-10">
        {currentStory + 1} / {stories.length}
      </div>
    </div>
  );
};

export default StoryContainer;
