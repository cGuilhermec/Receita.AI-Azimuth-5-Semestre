import { Home, BookOpen, Library, User, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'recipes', icon: BookOpen, label: 'Receitas' },
    { id: 'library', icon: Library, label: 'Biblioteca' },
    { id: 'profile', icon: User, label: 'Perfil' },
    { id: 'more', icon: MoreHorizontal, label: 'Mais' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border h-[60px] flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex flex-col items-center justify-center gap-1 touch-target transition-interactive focus-ring"
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon
              className={`w-6 h-6 ${
                isActive ? 'text-[#FF6B35]' : 'text-[#6C757D]'
              }`}
            />
            <span
              className={`text-xs ${
                isActive ? 'text-[#FF6B35]' : 'text-[#6C757D]'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}