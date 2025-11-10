import { ArrowLeft, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';

interface ProfileData {
  name: string;
  age: string;
  sex: string;
  dietaryRestrictions: string[];
  healthRestrictions: string[];
  nutritionalPreferences: {
    lowCalorie: boolean;
    highProtein: boolean;
    lowCarb: boolean;
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    lactoseFree: boolean;
  };
}

interface ProfileScreenProps {
  onBack: () => void;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetariano' },
  { id: 'vegan', label: 'Vegano' },
  { id: 'gluten-free', label: 'Sem Glúten' },
  { id: 'lactose-free', label: 'Sem Lactose' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'halal', label: 'Halal' },
];

const healthOptions = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hypertension', label: 'Hipertensão' },
  { id: 'cholesterol', label: 'Colesterol Alto' },
  { id: 'celiac', label: 'Doença Celíaca' },
  { id: 'ibs', label: 'Síndrome do Intestino Irritável' },
  { id: 'kidney', label: 'Problemas Renais' },
];

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'João Silva',
    age: '28',
    sex: 'masculino',
    dietaryRestrictions: ['vegetarian'],
    healthRestrictions: [],
    nutritionalPreferences: {
      lowCalorie: false,
      highProtein: true,
      lowCarb: false,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      lactoseFree: false,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  // Calculate profile completeness
  const calculateCompleteness = () => {
    let completed = 0;
    let total = 5; // Total sections to complete

    // Basic info (name, age, sex)
    if (profile.name && profile.age && profile.sex) completed++;
    
    // Dietary restrictions (at least reviewed)
    completed++;
    
    // Health restrictions (at least reviewed)
    completed++;
    
    // Nutritional preferences (at least one selected)
    const hasPreferences = Object.values(profile.nutritionalPreferences).some(v => v);
    if (hasPreferences) completed++;
    
    // Additional check - if all basic fields filled
    if (profile.name && profile.age && profile.sex && hasPreferences) completed++;

    return Math.round((completed / total) * 100);
  };

  const completeness = calculateCompleteness();

  const toggleDietaryRestriction = (restriction: string) => {
    setProfile(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  const toggleHealthRestriction = (restriction: string) => {
    setProfile(prev => ({
      ...prev,
      healthRestrictions: prev.healthRestrictions.includes(restriction)
        ? prev.healthRestrictions.filter(r => r !== restriction)
        : [...prev.healthRestrictions, restriction],
    }));
  };

  const toggleNutritionalPreference = (key: keyof ProfileData['nutritionalPreferences']) => {
    setProfile(prev => ({
      ...prev,
      nutritionalPreferences: {
        ...prev.nutritionalPreferences,
        [key]: !prev.nutritionalPreferences[key],
      },
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      onBack();
    }, 1000);
  };

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
                  <span className="text-sm text-[#FF6B35]">{completeness}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {completeness === 100 && (
          <div className="bg-[#E8F8F5] border-b border-[#28A745]/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-[#28A745] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          <Button variant="outline" className="text-[#FF6B35] border-[#FF6B35] hover:bg-[#FFF5F2]">
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
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Seu nome"
                className="bg-[#F8F9FA] border-[#6C757D]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="Idade"
                  className="bg-[#F8F9FA] border-[#6C757D]/30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <select
                  id="sex"
                  value={profile.sex}
                  onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-[#F8F9FA] border border-[#6C757D]/30 text-[#343A40]"
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Dietary Restrictions */}
        <section className="px-6 py-6 border-b border-border">
          <h3 className="text-lg text-[#343A40] mb-2">Restrições Alimentares</h3>
          <p className="text-sm text-[#6C757D] mb-4">
            Selecione suas preferências alimentares ou restrições
          </p>
          <div className="space-y-3">
            {dietaryOptions.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.label}
                </Label>
                <Switch
                  id={option.id}
                  checked={profile.dietaryRestrictions.includes(option.id)}
                  onCheckedChange={() => toggleDietaryRestriction(option.id)}
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
              <div key={option.id} className="flex items-center justify-between">
                <Label htmlFor={`health-${option.id}`} className="cursor-pointer">
                  {option.label}
                </Label>
                <Switch
                  id={`health-${option.id}`}
                  checked={profile.healthRestrictions.includes(option.id)}
                  onCheckedChange={() => toggleHealthRestriction(option.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Nutritional Preferences */}
        <section className="px-6 py-6">
          <h3 className="text-lg text-[#343A40] mb-2">Preferências Nutricionais</h3>
          <p className="text-sm text-[#6C757D] mb-4">
            Escolha seus objetivos e preferências nutricionais
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="lowCalorie" className="cursor-pointer">
                Baixa Caloria
              </Label>
              <Switch
                id="lowCalorie"
                checked={profile.nutritionalPreferences.lowCalorie}
                onCheckedChange={() => toggleNutritionalPreference('lowCalorie')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="highProtein" className="cursor-pointer">
                Alta Proteína
              </Label>
              <Switch
                id="highProtein"
                checked={profile.nutritionalPreferences.highProtein}
                onCheckedChange={() => toggleNutritionalPreference('highProtein')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowCarb" className="cursor-pointer">
                Baixo Carboidrato
              </Label>
              <Switch
                id="lowCarb"
                checked={profile.nutritionalPreferences.lowCarb}
                onCheckedChange={() => toggleNutritionalPreference('lowCarb')}
              />
            </div>
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
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>
    </div>
  );
}