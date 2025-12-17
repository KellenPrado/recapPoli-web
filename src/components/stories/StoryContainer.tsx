import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetchEmpresaData from "@/api/useFetchEmpresaData";
import StoryProgress from "./StoryProgress";
import StoryOpening from "./slides/StoryOpening";
import StoryInteractions from "./slides/StoryInteractions";
import StoryRanking from "./slides/StoryRanking";
import StoryClosing from "./slides/StoryClosing";
import StoryReceptiveStats from "./slides/StoryReceptiveStats";
import QuizMessages from "./slides/quizzes/QuizMessages";
import QuizAudios from "./slides/quizzes/QuizAudios";
import StoryFeedback from "./slides/StoryFeedback";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import logoImg from "@/assets/logo-poli.png";
import useFetchUserData from "@/api/useFetchUsersData";

const closeWidget = () => {
  // Send message to parent window to close the widget
  window.parent.postMessage({ type: "CLOSE_RETROSPECTIVE" }, "*");

  // Close the widget via global API if available
  if (window.RecapPoli) {
    window.RecapPoli.close();
  }
};

const STORY_DURATION = 15000; // 15 seconds per story

const stories = [
  StoryOpening, // 1 - Abertura
  StoryInteractions, // 2 - Interações
  StoryReceptiveStats, // 3 - Stats Receptivos
  QuizAudios, // 4 - Quiz: chats do usuário
  StoryRanking, // 5 - Top Colaboradores
  QuizMessages, // 6 - Quiz: mensangens enviadas
  StoryClosing, // 7 - Encerramento
  StoryFeedback, // 8 - Feedback
];

interface StoryContainerProps {
  id?: number;
  userId?: number;
}

const StoryContainer = ({ id, userId: propUserId }: StoryContainerProps) => {
  const [currentStory, setCurrentStory] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const customerId =
    id ||
    (searchParams.get("id") ? parseInt(searchParams.get("id")!) : undefined);
  // Pega o userId da URL ou usa undefined para ativar o default do hook
  const userId =
    propUserId ||
    (searchParams.get("userId")
      ? parseInt(searchParams.get("userId")!)
      : undefined);

  const { clientData, loading, error } = useFetchEmpresaData(customerId);
  // Usa o userId aqui, não o customerId
  const {
    clientData: userData,
    loading: userLoading,
    error: userError,
  } = useFetchUserData(userId);

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
    [goToNext, goToPrev],
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
        <div className="w-full max-w-lg mx-auto px-6 py-8 md:px-12 md:py-16">
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
                  [QuizAudios, StoryRanking].includes(CurrentStoryComponent)
                    ? userData
                    : clientData
                }
                id={customerId}
                userId={userId}
              />
            )
          )}
        </div>
      </div>

      {/* Navigation arrows (desktop) */}
      <div className="hidden md:flex absolute inset-y-0 left-2 items-center z-10">
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

      <div className="hidden md:flex absolute inset-y-0 right-2 items-center z-10">
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
      <div className="absolute top-4 left-4 z-20">
        <img
          src={logoImg}
          alt="Poli"
          className="h-6 md:h-8 w-auto opacity-80"
        />
      </div>
    </div>
  );
};

export default StoryContainer;
