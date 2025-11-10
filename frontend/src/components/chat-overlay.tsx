import { X, Send, ChefHat, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatOverlayProps {
  onClose: () => void;
}

const suggestions = [
  'Tornar vegano',
  'Reduzir calorias',
  'Sem glúten',
  'Mais rápido',
  'Mais saudável',
];

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Olá! Como posso ajudar a modificar esta receita?',
    sender: 'ai',
    timestamp: new Date(),
  },
];

export function ChatOverlay({ onClose }: ChatOverlayProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Ótima escolha! Vou adaptar a receita para ${text.toLowerCase()}. Aqui está a versão modificada com substituições apropriadas.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center sm:justify-center animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg h-[70vh] sm:h-[600px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg text-[#343A40]">Modificar Receita</h3>
          <button
            onClick={onClose}
            className="touch-target w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F9FA] transition-interactive focus-ring"
            aria-label="Fechar chat"
          >
            <X className="w-6 h-6 text-[#6C757D]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-[#4ECDC4]' : 'bg-[#FF6B35]'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <ChefHat className="w-5 h-5 text-white" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[75%] ${
                  message.sender === 'user' ? 'items-end' : 'items-start'
                } flex flex-col gap-1`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#4ECDC4] text-white rounded-br-none'
                      : 'bg-[#F8F9FA] text-[#343A40] rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-[#6C757D] px-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FF6B35] flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-white" />
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl rounded-bl-none px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#6C757D] rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        <div className="px-6 py-3 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex-shrink-0 touch-target px-4 py-2 bg-[#F8F9FA] hover:bg-[#FF6B35] hover:text-white text-[#343A40] rounded-full text-sm transition-interactive focus-ring"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua solicitação..."
              className="flex-1 rounded-lg border-[#6C757D]/30"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className="touch-target w-10 h-10 p-0 bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-lg flex-shrink-0 transition-interactive disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}