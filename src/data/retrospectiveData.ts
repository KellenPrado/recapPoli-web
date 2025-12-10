// ==========================================
// DADOS DA RETROSPECTIVA - CONFIGURAÇÃO POR CLIENTE
// Altere os valores abaixo para cada cliente
// ==========================================

export const clientData = {
  // Story 2 - Interações do Ano
  interactions: {
    mensagensTrocadas: 847293,
    audiosEnviados: 67890,
    chatsIniciadosEmpresa: 45678,
    contatosAtendidos: 32456,
    chatsIniciadosDisparador: 23456,
  },

  // Story 3 - Velocidade de Atendimento
  speed: {
    audiosRecebidos: 124567,
    chatsReceptivos: 38456,
    minutosEmLigacao: 15672,
  },

  // Story 4 - IA dominou 2025
  ai: {
    audiosTranscritos: 7620,
    respostasSugeridas: 27310,
    resumosConversas: 12450,
  },

  // Story 5 - Vendas
  sales: {
    valorTotalVendido: 12847,
    taxaConversao: 23, // em porcentagem
  },

  // Story 5 - Top 3 Colaboradores
  topCollaborators: [
    { name: "Ana Silva", totalChats: 4523, avgPerMonth: 377 },
    { name: "Carlos Mendes", totalChats: 4102, avgPerMonth: 342 },
    { name: "Julia Costa", totalChats: 3876, avgPerMonth: 323 },
  ],

  // Story 6 - Top 3 Usuários Mais Conectados
  topConnectedUsers: [
    { name: "Ana Silva", totalHours: 1223, avgPerMonth: 102 },
    { name: "Carlos Mendes", totalHours: 1620, avgPerMonth: 135 },
    { name: "Julia Costa", totalHours: 1450, avgPerMonth: 121 },
  ],

  // Story 7 - Departamento do Ano
  topDepartments: [
    { name: "Vendas", totalChats: 8945, avgPerMonth: 745 },
    { name: "Suporte", totalChats: 7230, avgPerMonth: 603 },
    { name: "Financeiro", totalChats: 5412, avgPerMonth: 451 },
  ],

  // Story 8 - Volume por Canal
  channelVolume: [
    { name: "WhatsApp", totalChats: 15234 },
    { name: "Instagram", totalChats: 3456 },
    { name: "Messenger", totalChats: 40 },
    { name: "Webchat", totalChats: 10 },
  ],
};

// ==========================================
// THRESHOLDS MÍNIMOS - Dados abaixo destes valores não são exibidos
// ==========================================

export const thresholds = {
  minutosEmLigacao: 500,
  valorTotalVendido: 3000,
  audiosTranscritos: 500,
  respostasSugeridas: 300,
  resumosConversas: 300,
};

// ==========================================
// FUNÇÕES AUXILIARES - NÃO MODIFICAR
// ==========================================

export type StatItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  thresholdKey?: keyof typeof thresholds;
};

// Ordena stats em ordem decrescente por valor e filtra por threshold
export const sortStatsDescending = (stats: StatItem[]): StatItem[] => {
  return [...stats]
    .filter((stat) => {
      if (stat.thresholdKey && thresholds[stat.thresholdKey] !== undefined) {
        return stat.value >= thresholds[stat.thresholdKey];
      }
      return true;
    })
    .sort((a, b) => b.value - a.value);
};

// Ordena rankings por totalChats em ordem decrescente e atribui posições
export const sortRankingDescending = <T extends { totalChats: number }>(items: T[]): (T & { position: number })[] => {
  return [...items]
    .sort((a, b) => b.totalChats - a.totalChats)
    .map((item, index) => ({ ...item, position: index + 1 }));
};

// Ordena rankings por totalHours em ordem decrescente e atribui posições
export const sortByHoursDescending = <T extends { totalHours: number }>(items: T[]): (T & { position: number })[] => {
  return [...items]
    .sort((a, b) => b.totalHours - a.totalHours)
    .map((item, index) => ({ ...item, position: index + 1 }));
};
