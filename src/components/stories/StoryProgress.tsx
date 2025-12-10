import { useEffect, useState } from "react";

interface StoryProgressProps {
  totalStories: number;
  currentStory: number;
  isPaused: boolean;
  duration: number;
  onComplete: () => void;
}

const StoryProgress = ({
  totalStories,
  currentStory,
  isPaused,
  duration,
  onComplete,
}: StoryProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
  }, [currentStory]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          onComplete();
          return 0;
        }
        return prev + 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, duration, onComplete, currentStory]);

  return (
    <div className="flex gap-1.5 px-4 py-3 w-full max-w-md mx-auto">
      {Array.from({ length: totalStories }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-100 ease-linear"
            style={{
              width:
                index < currentStory
                  ? "100%"
                  : index === currentStory
                  ? `${progress}%`
                  : "0%",
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryProgress;