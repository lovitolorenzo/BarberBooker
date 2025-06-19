import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-barbershop-muted hover:text-barbershop-gold">
          <Globe className="h-4 w-4 mr-2" />
          {i18n.language === 'it' ? 'IT' : 'EN'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="barbershop-card border-barbershop-dark" align="end">
        <DropdownMenuItem 
          onClick={() => changeLanguage('it')}
          className={`cursor-pointer ${i18n.language === 'it' ? 'barbershop-gold text-black' : 'text-barbershop-text hover:barbershop-charcoal'}`}
        >
          🇮🇹 {t('language.italian')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeLanguage('en')}
          className={`cursor-pointer ${i18n.language === 'en' ? 'barbershop-gold text-black' : 'text-barbershop-text hover:barbershop-charcoal'}`}
        >
          🇺🇸 {t('language.english')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
