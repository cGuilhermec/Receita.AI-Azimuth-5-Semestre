// components/login-screen.tsx
import { useState } from "react";
import { ChefHat, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../hooks/useAuth";

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: () => void;
  onRegister: () => void; // Adicione esta prop
}

export function LoginScreen({ onBack, onLoginSuccess, onRegister }: LoginScreenProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [touched, setTouched] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});

  // Validação de e-mail
  const validateEmail = (value: string) => {
    if (!value) {
      return "E-mail é obrigatório";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Digite um e-mail válido";
    }
    return "";
  };

  // Validação de senha - REMOVIDA A VALIDAÇÃO DE MÍNIMO DE CARACTERES
  const validatePassword = (value: string) => {
    if (!value) {
      return "Senha é obrigatória";
    }
    return "";
  };

  // Handler para blur
  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });

    if (field === "email") {
      const emailError = validateEmail(email);
      setErrors({ ...errors, email: emailError });
    } else if (field === "password") {
      const passwordError = validatePassword(password);
      setErrors({ ...errors, password: passwordError });
    }
  };

  // Handler para mudança no input
  const handleChange = (field: "email" | "password", value: string) => {
    if (field === "email") {
      setEmail(value);
      if (touched.email) {
        const emailError = validateEmail(value);
        setErrors({ ...errors, email: emailError });
      }
    } else if (field === "password") {
      setPassword(value);
      if (touched.password) {
        const passwordError = validatePassword(value);
        setErrors({ ...errors, password: passwordError });
      }
    }

    // Limpa erros gerais quando o usuário começa a digitar
    if (error) {
      clearError();
    }
  };

  // Handler de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marca todos os campos como touched
    setTouched({ email: true, password: true });

    // Valida todos os campos
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      await login({ email, password });
      onLoginSuccess(); // Só chama se o login for bem-sucedido
    } catch (err) {
      // O erro já é tratado pelo hook useAuth
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto pb-safe">
      <div className="min-h-screen flex flex-col p-8">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-8 pt-8">
          <button
            onClick={onBack}
            className="touch-target flex items-center justify-center w-[44px] h-[44px] rounded-lg hover:bg-[#F8F9FA] transition-interactive focus-ring"
            aria-label="Voltar"
            disabled={isLoading}
          >
            <ArrowLeft className="w-6 h-6 text-[#343A40]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-[#FF6B35] rounded-full p-2">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg text-[#343A40]">Receita.Ai</span>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <div className="space-y-6">
            {/* Título e descrição */}
            <div className="space-y-2">
              <h1 className="text-[#343A40]">Entrar na sua conta</h1>
              <p className="text-[#6C757D]">
                Entre com seu e-mail e senha para acessar suas receitas.
              </p>
            </div>

            {/* Mensagem de erro geral do hook useAuth */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-[#DC3545]/10 border border-[#DC3545]/20 rounded-lg animate-fade-in">
                <AlertCircle className="w-5 h-5 text-[#DC3545] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#DC3545]">{error}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Campo E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#343A40]">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full h-[44px] px-4 bg-[#F8F9FA] border rounded-lg transition-interactive focus-ring ${
                    errors.email && touched.email
                      ? "border-[#DC3545] focus:border-[#DC3545]"
                      : "border-transparent focus:border-[#FF6B35]"
                  }`}
                  disabled={isLoading}
                  aria-invalid={
                    errors.email && touched.email ? "true" : "false"
                  }
                  aria-describedby={
                    errors.email && touched.email ? "email-error" : undefined
                  }
                />
                {errors.email && touched.email && (
                  <div
                    className="flex items-center gap-2 animate-fade-in"
                    id="email-error"
                  >
                    <AlertCircle className="w-4 h-4 text-[#DC3545]" />
                    <p className="text-sm text-[#DC3545]">{errors.email}</p>
                  </div>
                )}
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#343A40]">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`w-full h-[44px] px-4 pr-12 bg-[#F8F9FA] border rounded-lg transition-interactive focus-ring ${
                      errors.password && touched.password
                        ? "border-[#DC3545] focus:border-[#DC3545]"
                        : "border-transparent focus:border-[#FF6B35]"
                    }`}
                    disabled={isLoading}
                    aria-invalid={
                      errors.password && touched.password ? "true" : "false"
                    }
                    aria-describedby={
                      errors.password && touched.password
                        ? "password-error"
                        : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 touch-target flex items-center justify-center w-[44px] h-[44px] text-[#6C757D] hover:text-[#343A40] transition-interactive focus-ring rounded"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div
                    className="flex items-center gap-2 animate-fade-in"
                    id="password-error"
                  >
                    <AlertCircle className="w-4 h-4 text-[#DC3545]" />
                    <p className="text-sm text-[#DC3545]">{errors.password}</p>
                  </div>
                )}
              </div>

              {/* Link Esqueceu a senha */}
              {/* <div className="flex justify-end">
                <button
                  type="button"
                  className="text-[#FF6B35] hover:text-[#FF6B35]/90 hover:underline transition-interactive focus-ring rounded px-2 py-1"
                  onClick={() => {
                    alert(
                      "Funcionalidade de recuperação de senha em desenvolvimento"
                    );
                  }}
                  disabled={isLoading}
                >
                  Esqueceu a senha?
                </button>
              </div> */}

              {/* Botão Entrar */}
              <Button
                type="submit"
                className="w-full h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg transition-interactive focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Link para criar conta */}
            <div className="text-center pt-4">
              <p className="text-[#6C757D]">
                Não tem uma conta?{" "}
                <button
                  onClick={onRegister} // Mude de onBack para onRegister
                  className="text-[#FF6B35] hover:text-[#FF6B35]/90 hover:underline transition-interactive focus-ring rounded px-1"
                  disabled={isLoading}
                >
                  Criar conta
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
