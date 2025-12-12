import { TrendingUp, DollarSign, Percent } from "lucide-react";
import AnimatedNumber from "../AnimatedNumber";
import { clientData, thresholds } from "@/data/retrospectiveData";

const StorySales = () => {
  const showValorTotalVendido = clientData.sales.valorTotalVendido >= thresholds.valorTotalVendido;

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-1.5">
      {/* Icon */}
      <div className="animate-fade-up opacity-0">
        <div className="relative">
          <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-30 animate-pulse-glow" />
          <div className="relative bg-gradient-primary p-5 rounded-full">
            <TrendingUp className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="animate-fade-up opacity-0 stagger-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Sim, as conversas
          <br />
          geraram vendas
        </h2>
      </div>

      {/* Stats */}
      <div className="space-y-1.5 w-full">
        {showValorTotalVendido && (
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 animate-fade-up opacity-0 stagger-3 border border-border/50">
            <div className="flex items-center justify-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-primary" />
              <span className="text-5xl md:text-6xl font-bold text-gradient-primary">
                <AnimatedNumber value={clientData.sales.valorTotalVendido} delay={400} />
              </span>
            </div>
            <p className="text-lg text-muted-foreground">Valor Total Vendido</p>
          </div>
        )}

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 animate-fade-up opacity-0 stagger-4 border border-border/50">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Percent className="w-6 h-6 text-primary" />
            <span className="text-4xl md:text-5xl font-bold text-gradient-primary">
              <AnimatedNumber value={clientData.sales.taxaConversao} delay={600} suffix="%" />
            </span>
          </div>
          <p className="text-muted-foreground">Taxa de Conversão</p>
        </div>
      </div>

      {/* Closing */}
      <div className="animate-fade-up opacity-0 stagger-5 pt-4">
        <p className="text-lg text-muted-foreground">
          Cada chat conta! <span className="text-2xl">😉</span>
        </p>
      </div>
    </div>
  );
};

export default StorySales;
