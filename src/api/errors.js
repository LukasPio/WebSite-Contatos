import axios from "axios";

export function getErrorMessage(error, fallback = "Não foi possível concluir a operação.") {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique sua conexão e tente novamente.";
    }
    if (error.response.status >= 500) {
      return "O servidor está indisponível no momento. Tente novamente em instantes.";
    }
  }
  return fallback;
}
