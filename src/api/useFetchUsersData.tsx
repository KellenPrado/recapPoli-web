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
const useFetchUserData = (user_id?: number) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user_id == null) {
        setClientData(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      try {
        // A. REQUISIÇÃO SUPABASE
        // Em vez de montar a URL e headers, usamos a sintaxe Builder do Supabase:
        const { data: userDataArray, error: supabaseError } = await supabase
          .from('user') // Nome da tabela
          .select('*') // Colunas a selecionar
          .eq('id', user_id) // O filtro WHERE id = user_id
          .limit(1) // Otimização: se espera apenas 1 item
          .single(); // Retorna um objeto único ou null, em vez de um array
        // B. TRATAMENTO DE ERROS DO SUPABASE
        if (supabaseError && supabaseError.code !== 'PGRST116') { // PGRST116 é 'nenhuma linha encontrada' com .single()
          throw supabaseError;
        }

        // C. TRATAMENTO DE DADOS RETORNADOS
        // Quando usamos .single(), o resultado (data) é o objeto diretamente ou null
        const userData = userDataArray; // Se .single() for usado e retornar dado

        if (!userData) {
          console.warn("[BACK] useFetchUserData: no user data returned for id", user_id);
          throw new Error("Nenhum dado do usuário encontrado com o ID fornecido.");
        }

        // 3. TRANSFORMAÇÃO DE DADOS (USANDO SUAS COLUNAS DO SUPABASE)
        const transformedData = {
          userYourself: {
            userName: userData?.name || 0,
            userChats: userData?.chats || 0,
            userMedia: userData?.media || 0,
          },
        };

        setClientData(transformedData);

      } catch (err) {
        console.error("[BACK] useFetchUserData: error", err);
        setError(err.message || "Ocorreu um erro ao conectar com o Supabase.");
        setClientData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Reexecuta se o user_id mudar
  }, [user_id]);
  // O retorno é o mesmo
  return { clientData, loading, error };

};

export default useFetchUserData;
