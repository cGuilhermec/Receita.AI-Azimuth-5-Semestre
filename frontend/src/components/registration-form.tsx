// components/RegistrationForm.tsx
import { ArrowLeft, ChefHat } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useUserRegistration } from "../hooks/useUserRegistration";

// Interface adaptada para o backend
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  weight: string;
  height: string;
  gender: string;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  lactose_intolerant: boolean;
  high_cholesterol: boolean;
  diabetes: boolean;
  hypertension: boolean;
  allergies: string;
}

interface RegistrationFormProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const dietaryPreferences = [
  {
    id: "vegetarian",
    label: "Vegetariano",
    description: "Não consome carne",
    backendField: "vegetarian",
  },
  {
    id: "vegan",
    label: "Vegano",
    description: "Não consome produtos de origem animal",
    backendField: "vegan",
  },
  {
    id: "gluten_free",
    label: "Intolerante ao Glúten",
    description: "Não consome glúten",
    backendField: "gluten_free",
  },
  {
    id: "lactose_intolerant",
    label: "Intolerante à Lactose",
    description: "Não consome laticínios",
    backendField: "lactose_intolerant",
  },
  {
    id: "high_cholesterol",
    label: "Colesterol Alto",
    description: "Requer dieta com baixo colesterol",
    backendField: "high_cholesterol",
  },
  {
    id: "diabetes",
    label: "Diabetes",
    description: "Controle de açúcar e carboidratos",
    backendField: "diabetes",
  },
  {
    id: "hypertension",
    label: "Hipertensão",
    description: "Redução de sódio",
    backendField: "hypertension",
  },
];

export function RegistrationForm({
  onComplete,
  onSkip,
  onBack,
}: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    gender: "",
    vegetarian: false,
    vegan: false,
    gluten_free: false,
    lactose_intolerant: false,
    high_cholesterol: false,
    diabetes: false,
    hypertension: false,
    allergies: "",
  });

  const { registerUser, isLoading, error } = useUserRegistration();

  const togglePreference = (backendField: string) => {
    setFormData((prev) => ({
      ...prev,
      [backendField]: !prev[backendField as keyof RegistrationData],
    }));
  };

  const canProceed = () => {
    if (step === 1) {
      return (
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== ""
      );
    }
    if (step === 2) {
      return (
        formData.weight !== "" &&
        formData.height !== "" &&
        formData.gender !== ""
      );
    }
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      // Preparar dados para enviar ao backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender,
        vegetarian: formData.vegetarian,
        vegan: formData.vegan,
        gluten_free: formData.gluten_free,
        lactose_intolerant: formData.lactose_intolerant,
        high_cholesterol: formData.high_cholesterol,
        diabetes: formData.diabetes,
        hypertension: formData.hypertension,
        allergies: formData.allergies,
      };

      await registerUser(userData);

      // Salvar no localStorage também se quiser
      localStorage.setItem("userProfile", JSON.stringify(formData));
      onComplete();
    } catch (err) {
      // O erro já é tratado no hook, podemos apenas logar se necessário
      console.error("Erro no formulário:", err);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center gap-4 px-4 border-b border-border bg-white z-10">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] disabled:opacity-50"
        >
          <ArrowLeft className="w-6 h-6 text-[#343A40]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B35] rounded-full p-1.5">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-[#343A40]">Receita.Ai</span>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="flex gap-2 px-6 py-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-[#FF6B35]" : "bg-[#F8F9FA]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Step 1: Dados básicos */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">Crie sua conta</h2>
              <p className="text-[#6C757D]">
                Vamos personalizar sua experiência
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Digite seu nome"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Digite seu e-mail"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Digite sua senha"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Medidas e gênero */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">Informações físicas</h2>
              <p className="text-[#6C757D]">
                Isso nos ajuda a criar receitas mais adequadas
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="Digite seu peso"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  min="1"
                  max="300"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) =>
                    setFormData({ ...formData, height: e.target.value })
                  }
                  placeholder="Digite sua altura"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  min="1"
                  max="250"
                  step="0.1"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full h-12 px-3 rounded-lg bg-[#F8F9FA] border border-[#6C757D]/30 text-[#343A40] disabled:opacity-50"
                  disabled={isLoading}
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Alergias alimentares</Label>
                <Input
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  placeholder="Ex: amendoim, frutos do mar, etc."
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferências alimentares */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">
                Preferências Alimentares
              </h2>
              <p className="text-[#6C757D]">
                Selecione suas restrições ou preferências alimentares
              </p>
            </div>

            <div className="space-y-3">
              {dietaryPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-[#F8F9FA] hover:bg-[#F8F9FA]/80 transition-colors"
                >
                  <div className="flex-1">
                    <Label htmlFor={pref.id} className="cursor-pointer block">
                      <p className="text-[#343A40] mb-1">{pref.label}</p>
                      <p className="text-sm text-[#6C757D]">
                        {pref.description}
                      </p>
                    </Label>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={
                      formData[
                        pref.backendField as keyof RegistrationData
                      ] as boolean
                    }
                    onCheckedChange={() => togglePreference(pref.backendField)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm text-[#6C757D] text-center">
                Você pode alterar essas preferências a qualquer momento no seu
                perfil
              </p>
            </div>
          </div>
        )}

        {/* Mensagem de erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <div className="border-t border-border bg-white px-6 py-4 space-y-3">
        {step < 3 ? (
          <>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Carregando..." : "Continuar"}
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              disabled={isLoading}
              className="w-full h-12 text-[#6C757D] hover:text-[#343A40] hover:bg-[#F8F9FA] disabled:opacity-50"
            >
              Usar sem registro
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Criando conta..." : "Criar Conta"}
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              disabled={isLoading}
              className="w-full h-12 text-[#6C757D] hover:text-[#343A40] hover:bg-[#F8F9FA] disabled:opacity-50"
            >
              Pular e começar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
