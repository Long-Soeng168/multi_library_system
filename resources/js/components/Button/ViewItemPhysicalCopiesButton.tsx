import usePermission from '@/hooks/use-permission';
import { Link } from '@inertiajs/react';
import { BookCopyIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { TooltipButton } from './TooltipButton';

const ViewItemPhysicalCopiesButton = ({ url, permission }: { url?: string; permission?: string }) => {
    const hasPermission = usePermission();
    if (permission && !hasPermission(permission)) {
        return null;
    }
    return (
        <Link href={url}>
            <TooltipButton tooltip="Physical Copies" side="bottom">
                <Button variant="outline" size="icon" className="text-blue-600 shadow-none hover:text-blue-500 dark:text-blue-600/90">
                    <BookCopyIcon />
                </Button>
            </TooltipButton>
        </Link>
    );
};

export default ViewItemPhysicalCopiesButton;
