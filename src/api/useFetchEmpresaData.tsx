import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. Defina as constantes de acesso à API REST
const SUPABASE_URL = 'https://ptnldcgmgcilqftamawk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-9QTMGtF4Q55ugsJieiamw_0IZBoJt-'; // Sua chave 'anon'

// 2. Definição do Custom Hook
const useFetchEmpresaData = (customer_id = 1, userId = 17258) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // A. CONSTRUÇÃO DA URL E DO FILTRO
        // URL: https://[YOUR_PROJECT_REF].supabase.co/rest/v1/empresa?id=eq.[CUSTOMER_ID]
        const apiURL = `${SUPABASE_URL}/rest/v1/empresa?id=eq.${customer_id}&select=*`;

        // B. REQUISIÇÃO AXIOS
        const response = await axios.get(apiURL, {
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY, // Chave pública (anon)
            'Authorization': `Bearer ${SUPABASE_KEY}` // Padrão de autorização
          }
        });

        // O Axios retorna os dados em response.data
        const empresaDataArray = response.data;
        const userDataArray = response.data;

        // Como você usava .single() antes, assumimos que esperamos um array com 1 item
        const empresaData = empresaDataArray.length > 0 ? empresaDataArray[0] : null;
        const userData = userDataArray.length > 0 ? userDataArray[0] : null;

        if (!empresaData) {
          // Se a busca retornar vazia (array []), tratamos como sucesso, mas sem dados
          throw new Error("Nenhum dado da empresa encontrado com o ID fornecido.");
        }
        if (!userData) {
          // Se a busca retornar vazia (array []), tratamos como sucesso, mas sem dados
          throw new Error("Nenhum dado do usuário encontrado com o ID fornecido.");
        }

        // 3. TRANSFORMAÇÃO DE DADOS (USANDO SUAS COLUNAS DO SUPABASE)
        const transformedData = {
          // ... (O restante da sua lógica de mapeamento permanece a mesma)
          // Story 4 - Interações do Ano
          interactions: {
            mensagensTrocadas: empresaData?.total_msgs || 0,
            audiosEnviados: empresaData?.audio_enviado || 0,
            chatsIniciadosEmpresa: empresaData?.active_msgs || 0,
            contatosAtendidos: empresaData?.contacts || 0,
            chatsIniciadosDisparador: empresaData?.disparo || 0,
          },

          // Story 6 - Velocidade de Atendimento
          speed: {
            audiosRecebidos: empresaData?.audio_recebido || 0,
            chatsReceptivos: empresaData?.chats || 0,
            minutosEmLigacao: empresaData?.receptive_msgs || 0,
          },
          // Story 8 - Ranking Chats
          ranking: {
            userName: userData?.name || 0,
            userChats: userData?.chats || 0,
          },

          // Story 9 - Ranking tempo conectado
          userLogs: {
            userName: userData?.name || 0,
            userLogs: userData?.logs || 0,
          },
        };

        setClientData(transformedData);

      } catch (err) {
        // Captura erros do Axios ou do throw manual
        console.error("Erro ao buscar dados com Axios:", err.message || err.toString());
        setError(err.message || "Ocorreu um erro ao conectar com a API.");
        setClientData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Reexecuta se o customer_id mudar
  }, [customer_id]);

  // O retorno é o mesmo
  return { clientData, loading, error };
};

export default useFetchEmpresaData;