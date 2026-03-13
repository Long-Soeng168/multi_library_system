import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { Link } from '@inertiajs/react';
import { LucideIcon, PlusIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface NewItemButtonProps {
    url?: string;
    permission?: string;
    label?: string;
    icon?: LucideIcon; // allow passing any lucide icon
}

const NewItemButton = ({ url, permission, label = 'Add New', icon: Icon = PlusIcon }: NewItemButtonProps) => {
    const hasPermission = usePermission();
    if (permission && !hasPermission(permission)) return null;

    const { t } = useTranslation();

    const content = (
        <Button variant="default" size="lg" className="h-11 shadow-none">
            <Icon className="mr-2 h-4 w-4" /> {t(label)}
        </Button>
    );

    return url ? (
        <Link href={url} prefetch>
            {content}
        </Link>
    ) : (
        content
    );
};

export default NewItemButton;
