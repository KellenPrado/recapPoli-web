import { Sparkles } from "lucide-react";

const StoryOpening = ({ data }: { data?: any }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1.5 md:space-y-6">
      {/* Icon */}
      <div className="animate-fade-up opacity-0">
        <div className="relative">
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse-glow" />
          <div className="relative bg-gradient-primary p-4 rounded-full">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2 animate-fade-up opacity-0 stagger-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gradient-primary leading-tight">
          Sua Retrospectiva
          <br />
          2025
        </h1>
      </div>

      {/* Subtitle */}
      <div className="space-y-4 animate-fade-up opacity-0 stagger-3">
        <p className="text-lg md:text-xl font-semibold text-foreground">Seu ano em números!</p>
        <p className="text-lg text-muted-foreground">Vamos ver o que aconteceu?</p>
      </div>

      {/* Tap hint */}
      <div className="animate-fade-up opacity-0 stagger-4 mt-8">
        <p className="text-sm text-muted-foreground animate-pulse">Toque para avançar →</p>
      </div>
    </div>
  );
};

export default StoryOpening;
