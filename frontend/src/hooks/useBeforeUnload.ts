// hooks/useBeforeUnload.ts - NOVO HOOK
import { useEffect } from "react";

export function useBeforeUnload(hasData: boolean) {
  useEffect(() => {
    if (!hasData) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue =
        "Você tem receitas não salvas. Tem certeza que deseja sair?";
      return "Você tem receitas não salvas. Tem certeza que deseja sair?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasData]);
}
