import { ArrowLeft, ChefHat } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface RegistrationData {
  name: string;
  age: string;
  sex: string;
  preferences: string[];
}

interface RegistrationFormProps {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const dietaryPreferences = [
  { id: 'vegetarian', label: 'Vegetariano', description: 'Não consome carne' },
  { id: 'vegan', label: 'Vegano', description: 'Não consome produtos de origem animal' },
  { id: 'celiac', label: 'Celíaco', description: 'Intolerância ao glúten' },
  { id: 'lactose-intolerant', label: 'Intolerante à Lactose', description: 'Não consome laticínios' },
  { id: 'high-cholesterol', label: 'Colesterol Alto', description: 'Requer dieta com baixo colesterol' },
  { id: 'diabetes', label: 'Diabetes', description: 'Controle de açúcar e carboidratos' },
  { id: 'hypertension', label: 'Hipertensão', description: 'Redução de sódio' },
  { id: 'low-carb', label: 'Low Carb', description: 'Preferência por baixo carboidrato' },
  { id: 'high-protein', label: 'Alta Proteína', description: 'Foco em proteínas' },
];

export function RegistrationForm({ onComplete, onSkip, onBack }: RegistrationFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    age: '',
    sex: '',
    preferences: [],
  });

  const togglePreference = (preference: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference],
    }));
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.name.trim() !== '';
    }
    if (step === 2) {
      return formData.age !== '' && formData.sex !== '';
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

  const handleComplete = () => {
    // Save registration data
    localStorage.setItem('userProfile', JSON.stringify(formData));
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center gap-4 px-4 border-b border-border bg-white z-10">
        <button
          onClick={step === 1 ? onBack : () => setStep(step - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA]"
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
              s <= step ? 'bg-[#FF6B35]' : 'bg-[#F8F9FA]'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        {/* Step 1: Name */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">Qual é o seu nome?</h2>
              <p className="text-[#6C757D]">
                Vamos personalizar sua experiência
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite seu nome"
                className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
              />
            </div>
          </div>
        )}

        {/* Step 2: Age and Sex */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">Conte mais sobre você</h2>
              <p className="text-[#6C757D]">
                Isso nos ajuda a criar receitas mais adequadas
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Digite sua idade"
                  className="bg-[#F8F9FA] border-[#6C757D]/30 h-12"
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <select
                  id="sex"
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full h-12 px-3 rounded-lg bg-[#F8F9FA] border border-[#6C757D]/30 text-[#343A40]"
                >
                  <option value="">Selecione</option>
                  <option value="feminino">Feminino</option>
                  <option value="masculino">Masculino</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dietary Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl text-[#343A40]">Preferências Alimentares</h2>
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
                      <p className="text-sm text-[#6C757D]">{pref.description}</p>
                    </Label>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={formData.preferences.includes(pref.id)}
                    onCheckedChange={() => togglePreference(pref.id)}
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <p className="text-sm text-[#6C757D] text-center">
                Você pode alterar essas preferências a qualquer momento no seu perfil
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <div className="border-t border-border bg-white px-6 py-4 space-y-3">
        {step < 3 ? (
          <>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              className="w-full h-12 text-[#6C757D] hover:text-[#343A40] hover:bg-[#F8F9FA]"
            >
              Usar sem registro
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={handleComplete}
              className="w-full h-12 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg"
            >
              Começar a Usar
            </Button>
            <Button
              onClick={onSkip}
              variant="ghost"
              className="w-full h-12 text-[#6C757D] hover:text-[#343A40] hover:bg-[#F8F9FA]"
            >
              Pular e começar
            </Button>
          </>
        )}
      </div>
    </div>
  );
}