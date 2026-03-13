import usePermission from '@/hooks/use-permission';
import { Link } from '@inertiajs/react';
import { EditIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipButton } from './TooltipButton';

const EditItemButton = ({ url, permission }: { url?: string; permission?: string }) => {
    const hasPermission = usePermission();
    if (permission && !hasPermission(permission)) {
        return null;
    }

    return (
        <Link href={url}>
            <TooltipButton tooltip="Edit Item" side="bottom">
                <Button variant="outline" size="icon" className="text-primary shadow-none hover:text-primary">
                    <EditIcon />
                </Button>
            </TooltipButton>
        </Link>
    );
};

export default EditItemButton;
