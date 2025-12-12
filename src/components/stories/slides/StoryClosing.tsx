import { Rocket, Zap, Link2, Target, Heart } from "lucide-react";

const features = [
  { icon: Zap, text: "Mais agilidade" },
  { icon: Link2, text: "Mais integração" },
  { icon: Target, text: "Mais resultados" },
];

const StoryClosing = ({ data }: { data?: any }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1.5">
      {/* Icon */}
      <div className="animate-fade-up opacity-0">
        <div className="relative">
          <div className="absolute inset-0 bg-primary rounded-full blur-2xl opacity-30 animate-pulse-glow" />
          <div className="relative bg-gradient-primary p-4 rounded-full animate-float">
            <Rocket className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="animate-fade-up opacity-0 stagger-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          O que vem em <span className="text-gradient-coral">2026</span>?
        </h2>
      </div>

      {/* Features */}
      <div className="space-y-1.5 w-full max-w-xs">
        {features.map((feature, index) => (
          <div
            key={feature.text}
            className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-4 animate-fade-up opacity-0 border border-border/50"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <div className="bg-gradient-primary p-2 rounded-lg shrink-0">
              <feature.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-base font-semibold text-foreground">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Closing */}
      <div className="flex items-center justify-center gap-2 animate-fade-up opacity-0 stagger-5 pt-4">
        <p className="text-lg text-muted-foreground">E claro… mais histórias para contar</p>
        <Heart className="w-6 h-6 text-coral fill-coral animate-pulse flex-shrink-0" />
      </div>

      {/* Thank you */}
      <div className="animate-fade-up opacity-0 pt-4" style={{ animationDelay: "0.8s" }}>
        <p className="text-xl font-bold text-gradient-primary">Obrigado por fazer parte!</p>
      </div>
    </div>
  );
};

export default StoryClosing;
