import usePermission from '@/hooks/use-permission';
import { Link } from '@inertiajs/react';
import { ViewIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipButton } from './TooltipButton';

const ViewItemButton = ({ url, permission }: { url?: string; permission?: string }) => {
    const hasPermission = usePermission();
    if (permission && !hasPermission(permission)) {
        return null;
    }
    return (
        <Link href={url}>
            <TooltipButton tooltip="View Item" side="bottom">
                <Button variant="outline" size="icon" className="shadow-none dark:text-muted-foreground">
                    <ViewIcon />
                </Button>
            </TooltipButton>
        </Link>
    );
};

export default ViewItemButton;
