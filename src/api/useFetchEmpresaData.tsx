import { useState, useEffect } from 'react';
// 1. Importe o createClient do Supabase
import { createClient } from '@supabase/supabase-js';

// 2. Defina as constantes de acesso ao Supabase
// (Ajustei o nome da chave para refletir que é a chave "anon")
const SUPABASE_URL = 'https://ptnldcgmgcilqftamawk.supabase.co';
// **USE SUA CHAVE ANON REAL AQUI (Geralmente começa com eyJ...)**
const SUPABASE_ANON_KEY = 'sb_publishable_-9QTMGtF4Q55ugsJieiamw_0IZBoJt-';

// 3. Inicialize o cliente Supabase fora do componente/hook 
// (Ele será reutilizado em todas as chamadas)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// 4. Definição do Custom Hook
// Nota: O seu código original buscava a mesma tabela (empresa) duas vezes,
// uma para 'customer_id' e outra para 'userId'. Para simplificar, 
// a busca principal continua focada na 'empresa' pelo 'customer_id'.
const useFetchEmpresaData = (customer_id?: number) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (customer_id == null) {
        setClientData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // A. REQUISIÇÃO SUPABASE
        // Em vez de montar a URL e headers, usamos a sintaxe Builder do Supabase:
        const { data: empresaDataArray, error: supabaseError } = await supabase
          .from('empresa') // Nome da tabela
          .select('*') // Colunas a selecionar
          .eq('id', customer_id) // O filtro WHERE id = customer_id
          .limit(1) // Otimização: se espera apenas 1 item
          .single(); // Retorna um objeto único ou null, em vez de um array

        // B. TRATAMENTO DE ERROS DO SUPABASE
        if (supabaseError && supabaseError.code !== 'PGRST116') { // PGRST116 é 'nenhuma linha encontrada' com .single()
          throw supabaseError;
        }

        // C. TRATAMENTO DE DADOS RETORNADOS
        // Quando usamos .single(), o resultado (data) é o objeto diretamente ou null
        const empresaData = empresaDataArray; // Se .single() for usado e retornar dado 
        const userData = empresaDataArray; // Assumindo que dados do usuário estão na mesma linha (ou faça uma 2ª busca)

        if (!empresaData) {
          console.warn("[BACK] useFetchEmpresaData: no empresa data returned for id", customer_id);
          throw new Error("Nenhum dado da empresa encontrado com o ID fornecido.");
        }


        const transformedData = {
          interactions: {
            mensagensTrocadas: empresaData?.total_msgs || 0,
            audiosEnviados: empresaData?.audio_enviado || 0,
            chatsIniciadosEmpresa: empresaData?.active_msgs || 0,
            contatosAtendidos: empresaData?.contacts || 0,
            chatsIniciadosDisparador: empresaData?.disparo || 0,
          },

          speed: {
            audiosRecebidos: empresaData?.audio_recebido || 0,
            chatsReceptivos: empresaData?.chats || 0,
            minutosEmLigacao: empresaData?.receptive_msgs || 0,
          },
          userYourself: {
            userName: userData?.name || 0,
            userChats: userData?.chats || 0,
          },

          userLogs: {
            userName: userData?.name || 0,
            userLogs: userData?.logs || 0,
          },
        };

        setClientData(transformedData);

      } catch (err) {
        // Captura erros do Supabase (console.error removido para produção)
        setError(err.message || "Ocorreu um erro ao conectar com o Supabase.");
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