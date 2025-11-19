// components/profile-screen.tsx - versão atualizada
import { ArrowLeft, User, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Progress } from "./ui/progress";
import { useAuth } from "../hooks/useAuth";
import { userService, UserProfile } from "../services/userService";

interface ProfileScreenProps {
  onBack: () => void;
}

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetariano", field: "vegetarian" },
  { id: "vegan", label: "Vegano", field: "vegan" },
  { id: "gluten_free", label: "Sem Glúten", field: "gluten_free" },
  {
    id: "lactose_intolerant",
    label: "Intolerante à Lactose",
    field: "lactose_intolerant",
  },
];

const healthOptions = [
  { id: "diabetes", label: "Diabetes", field: "diabetes" },
  { id: "hypertension", label: "Hipertensão", field: "hypertension" },
  {
    id: "high_cholesterol",
    label: "Colesterol Alto",
    field: "high_cholesterol",
  },
];

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    weight: null,
    height: null,
    gender: "",
    vegetarian: false,
    vegan: false,
    gluten_free: false,
    lactose_intolerant: false,
    high_cholesterol: false,
    diabetes: false,
    hypertension: false,
    allergies: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do perfil quando o componente montar
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const userProfile = await userService.getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      // Se não conseguir carregar, usa os dados básicos do usuário
      if (user) {
        setProfile((prev) => ({
          ...prev,
          id: user.id,
          name: user.name,
          email: user.email,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let completed = 0;
    let total = 4; // Total sections to complete

    // Basic info (name, weight, height, gender)
    if (profile.name && profile.weight && profile.height && profile.gender)
      completed++;

    // Dietary restrictions (at least reviewed)
    if (
      profile.vegetarian !== undefined ||
      profile.vegan !== undefined ||
      profile.gluten_free !== undefined ||
      profile.lactose_intolerant !== undefined
    )
      completed++;

    // Health restrictions (at least reviewed)
    if (
      profile.diabetes !== undefined ||
      profile.hypertension !== undefined ||
      profile.high_cholesterol !== undefined
    )
      completed++;

    // Allergies (considered complete if filled or explicitly empty)
    completed++;

    return Math.round((completed / total) * 100);
  };

  const completeness = calculateCompleteness();

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await userService.updateProfile(profile);
      console.log("Perfil salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      alert("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
      onBack();
    }
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6C757D]">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center gap-4 px-4 border-b border-border bg-white z-10">
        <button
          onClick={onBack}
          className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-6 h-6 text-[#343A40]" />
        </button>
        <h2 className="text-lg text-[#343A40]">Meu Perfil</h2>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Profile Completeness Banner */}
        {completeness < 100 && (
          <div className="bg-[#FFF5F2] border-b border-[#FF6B35]/20 px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#FF6B35] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#343A40] mb-2">
                  Complete seu perfil para receber receitas mais personalizadas
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={completeness} className="flex-1 h-2" />
                  <span className="text-sm text-[#FF6B35]">
                    {completeness}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {completeness === 100 && (
          <div className="bg-[#E8F8F5] border-b border-[#28A745]/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#28A745] rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm text-[#28A745]">
                Perfil completo! Você receberá as melhores recomendações.
              </p>
            </div>
          </div>
        )}

        {/* Profile Photo */}
        <div className="px-6 py-6 flex flex-col items-center gap-4 border-b border-border">
          <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-[#6C757D]" />
          </div>
          <Button
            variant="outline"
            className="text-[#FF6B35] border-[#FF6B35] hover:bg-[#FFF5F2]"
          >
            Alterar Foto
          </Button>
        </div>

        {/* Basic Information */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-lg text-[#343A40] mb-4">Informações Básicas</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={profile.name || ""}
                onChange={(e) => updateProfileField("name", e.target.value)}
                placeholder="Seu nome"
                className="bg-[#F8F9FA] border-[#6C757D]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight || ""}
                  onChange={(e) =>
                    updateProfileField(
                      "weight",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="Peso"
                  className="bg-[#F8F9FA] border-[#6C757D]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height || ""}
                  onChange={(e) =>
                    updateProfileField(
                      "height",
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="Altura"
                  className="bg-[#F8F9FA] border-[#6C757D]/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gênero</Label>
              <select
                id="gender"
                value={profile.gender || ""}
                onChange={(e) => updateProfileField("gender", e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#F8F9FA] border border-[#6C757D]/30 text-[#343A40]"
              >
                <option value="">Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="outro">Outro</option>
                <option value="prefiro_nao_informar">
                  Prefiro não informar
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-lg text-[#343A40] mb-2">
            Restrições Alimentares
          </h3>
          <p className="text-sm text-[#6C757D] mb-4">
            Selecione suas preferências alimentares ou restrições
          </p>
          <div className="space-y-3">
            {dietaryOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between"
              >
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
                <Switch
                  id={option.id}
                  checked={
                    (profile[option.field as keyof UserProfile] as boolean) ||
                    false
                  }
                  onCheckedChange={(checked: any) =>
                    updateProfileField(
                      option.field as keyof UserProfile,
                      checked
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Health Restrictions */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-lg text-[#343A40] mb-2">Condições de Saúde</h3>
          <p className="text-sm text-[#6C757D] mb-4">
            Informe condições que requerem cuidados alimentares especiais
          </p>
          <div className="space-y-3">
            {healthOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between"
              >
                <Label
                  htmlFor={`health-${option.id}`}
                  className="cursor-pointer"
                >
                  {option.label}
                </Label>
                <Switch
                  id={`health-${option.id}`}
                  checked={
                    (profile[option.field as keyof UserProfile] as boolean) ||
                    false
                  }
                  onCheckedChange={(checked: any) =>
                    updateProfileField(
                      option.field as keyof UserProfile,
                      checked
                    )
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Allergies */}
        <section className="px-6 py-6">
          <h3 className="text-lg text-[#343A40] mb-2">Alergias Alimentares</h3>
          <p className="text-sm text-[#6C757D] mb-4">
            Liste alimentos que causam alergia (separados por vírgula)
          </p>
          <div className="space-y-2">
            <Label htmlFor="allergies">Alergias</Label>
            <Input
              id="allergies"
              value={profile.allergies || ""}
              onChange={(e) => updateProfileField("allergies", e.target.value)}
              placeholder="Ex: amendoim, camarão, glúten..."
              className="bg-[#F8F9FA] border-[#6C757D]/30"
            />
          </div>
        </section>
      </main>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-6 py-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg"
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}
