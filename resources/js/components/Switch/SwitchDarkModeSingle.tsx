import { useAppearance } from '@/hooks/use-appearance';
import { MoonIcon, SunMediumIcon } from 'lucide-react';
import { Button } from '../ui/button';

export default function SwitchDarkModeSingle({ className = '' }: { className?: string }) {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark';

    const handleToggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <Button onClick={handleToggle} variant="outline" size="sm" className="size-9">
            {isDark ? (
                <MoonIcon className="h-4 w-4" /> // moon icon bright
            ) : (
                <SunMediumIcon className="h-4 w-4" /> // sun icon bright
            )}
        </Button>
    );
}
