import { Camera, ChefHat, User, Plus, X, HelpCircle, Check, Upload, Edit3 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { BottomNav } from './bottom-nav';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface HomeScreenProps {
  onCaptureImage: () => void;
  onCreateRecipes: () => void;
  onProfileClick: () => void;
}

interface IngredientItem {
  type: 'image' | 'manual';
  value: string; // URL for images, name for manual entries
}

export function HomeScreen({ onCaptureImage, onCreateRecipes, onProfileClick }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualIngredientName, setManualIngredientName] = useState('');

  const handleImageCapture = () => {
    // Simulate image capture
    const mockImage = `https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop`;
    setPreviewImage(mockImage);
    setShowPreview(true);
    onCaptureImage();
  };

  const confirmImage = () => {
    if (previewImage) {
      setIngredients([...ingredients, { type: 'image', value: previewImage }]);
      setPreviewImage(null);
      setShowPreview(false);
    }
  };

  const discardImage = () => {
    setPreviewImage(null);
    setShowPreview(false);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddOptionsClick = () => {
    setShowAddOptions(true);
  };

  const handlePhotoOption = () => {
    setShowAddOptions(false);
    handleImageCapture();
  };

  const handleManualOption = () => {
    setShowAddOptions(false);
    setShowManualInput(true);
  };

  const handleManualIngredientSubmit = () => {
    if (manualIngredientName.trim()) {
      setIngredients([...ingredients, { type: 'manual', value: manualIngredientName.trim() }]);
      setManualIngredientName('');
      setShowManualInput(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF6B35] rounded-full p-1.5">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg text-[#343A40]">Receita.Ai</span>
        </div>
        <button
          onClick={onProfileClick}
          className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
          aria-label="Perfil do usuário"
        >
          <User className="w-6 h-6 text-[#6C757D]" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-[140px]">
        {/* Hero Section */}
        <div className="px-6 pt-10 pb-8 text-center">
          <h1 className="text-3xl text-[#343A40] mb-3">
            O que vamos cozinhar hoje?
          </h1>
          <p className="text-[#6C757D] max-w-md mx-auto">
            Fotografe seus ingredientes e nossa IA criará receitas personalizadas para você.
          </p>
        </div>

        {/* Capture Area */}
        <div className="px-6">
          <div className="relative">
            <button
              onClick={handleImageCapture}
              className="w-full bg-[#F8F9FA] border-2 border-dashed border-[#6C757D]/30 rounded-xl p-12 flex flex-col items-center justify-center gap-3 hover:bg-[#F8F9FA]/80 hover:border-[#FF6B35]/50 transition-interactive focus-ring"
              aria-label="Fotografar ingredientes"
            >
              <Camera className="w-12 h-12 text-[#FF6B35]" />
              <div className="text-center">
                <p className="text-[#343A40]">Toque para fotografar ingredientes</p>
                <p className="text-sm text-[#6C757D] mt-1">ou escolher da galeria</p>
              </div>
            </button>
            
            {/* Tutorial Help Button */}
            <button
              onClick={() => setShowTutorial(true)}
              className="absolute top-3 right-3 touch-target w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white shadow-sm transition-interactive focus-ring"
              aria-label="Ajuda de captura"
            >
              <HelpCircle className="w-5 h-5 text-[#FF6B35]" />
            </button>
          </div>
        </div>

        {/* Ingredients Gallery */}
        {ingredients.length > 0 && (
          <div className="px-6 mt-6">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="relative flex-shrink-0">
                  {ingredient.type === 'image' ? (
                    <img
                      src={ingredient.value}
                      alt={`Ingredient ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-[#4ECDC4]/10 border-2 border-[#4ECDC4] flex items-center justify-center p-2">
                      <p className="text-xs text-center text-[#343A40] line-clamp-3">
                        {ingredient.value}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => removeIngredient(index)}
                    className="absolute -top-2 -right-2 touch-target w-7 h-7 bg-[#DC3545] rounded-full flex items-center justify-center shadow-md hover:bg-[#DC3545]/90 transition-interactive focus-ring"
                    aria-label={`Remover ingrediente ${index + 1}`}
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="absolute top-1 left-1 bg-[#343A40]/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
              <button
                onClick={handleAddOptionsClick}
                className="flex-shrink-0 touch-target w-20 h-20 bg-[#F8F9FA] border-2 border-dashed border-[#6C757D]/30 rounded-lg flex items-center justify-center hover:bg-[#F8F9FA]/80 hover:border-[#FF6B35]/50 transition-interactive focus-ring"
                aria-label="Adicionar mais ingredientes"
              >
                <Plus className="w-6 h-6 text-[#6C757D]" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create Recipes Button - Always visible but disabled when no ingredients */}
      <div className="fixed bottom-[76px] left-0 right-0 px-6 pb-4">
        <Button
          onClick={onCreateRecipes}
          disabled={ingredients.length === 0}
          className="w-full h-[52px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white rounded-lg shadow-lg flex items-center justify-center gap-2 transition-interactive disabled:bg-[#6C757D]/30 disabled:text-[#6C757D]/50 disabled:cursor-not-allowed disabled:shadow-none focus-ring"
          aria-label={ingredients.length === 0 ? "Adicione ingredientes para criar receitas" : "Criar receitas"}
        >
          <ChefHat className="w-5 h-5" />
          CRIAR MINHAS RECEITAS
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Image Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Imagem</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="py-4">
              <img
                src={previewImage}
                alt="Prévia da imagem capturada"
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={discardImage}
              className="flex-1 h-[44px] transition-interactive focus-ring"
            >
              Descartar
            </Button>
            <Button
              onClick={confirmImage}
              className="flex-1 h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-interactive focus-ring"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Dialog */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dicas de Captura</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Boa iluminação</p>
                <p className="text-sm text-[#6C757D]">
                  Certifique-se de ter luz suficiente para ver os ingredientes claramente.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Enquadramento</p>
                <p className="text-sm text-[#6C757D]">
                  Posicione os ingredientes no centro da foto, evitando sombras.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm text-[#343A40] mb-1">Separação</p>
                <p className="text-sm text-[#6C757D]">
                  Separe os ingredientes para facilitar a identificação.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowTutorial(false)}
              className="w-full h-[44px] bg-[#FF6B35] hover:bg-[#FF6B35]/90 transition-interactive focus-ring"
            >
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Options Sheet */}
      <Sheet open={showAddOptions} onOpenChange={setShowAddOptions}>
        <SheetContent side="bottom" className="h-auto">
          <SheetHeader>
            <SheetTitle>Adicionar Ingrediente</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-3">
            <button
              onClick={handlePhotoOption}
              className="w-full h-[60px] flex items-center gap-4 px-4 rounded-lg bg-[#F8F9FA] hover:bg-[#FF6B35]/10 border-2 border-transparent hover:border-[#FF6B35]/30 transition-interactive focus-ring"
            >
              <div className="w-12 h-12 rounded-full bg-[#FF6B35]/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#343A40]">Fotografar ou Fazer Upload</p>
                <p className="text-sm text-[#6C757D]">Tire uma foto ou escolha da galeria</p>
              </div>
            </button>

            <button
              onClick={handleManualOption}
              className="w-full h-[60px] flex items-center gap-4 px-4 rounded-lg bg-[#F8F9FA] hover:bg-[#4ECDC4]/10 border-2 border-transparent hover:border-[#4ECDC4]/30 transition-interactive focus-ring"
            >
              <div className="w-12 h-12 rounded-full bg-[#4ECDC4]/10 flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[#343A40]">Adicionar Manualmente</p>
                <p className="text-sm text-[#6C757D]">Digite o nome do ingrediente</p>
              </div>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Manual Ingredient Input Dialog */}
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Ingrediente</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredient-name">Nome do Ingrediente</Label>
              <Input
                id="ingredient-name"
                value={manualIngredientName}
                onChange={(e) => setManualIngredientName(e.target.value)}
                placeholder="Ex: Tomate, Cebola, Alho..."
                className="h-[44px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleManualIngredientSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowManualInput(false);
                setManualIngredientName('');
              }}
              className="flex-1 h-[44px] transition-interactive focus-ring"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleManualIngredientSubmit}
              disabled={!manualIngredientName.trim()}
              className="flex-1 h-[44px] bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 transition-interactive focus-ring disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}