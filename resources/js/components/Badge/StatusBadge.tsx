import { Badge } from '@/components/ui/badge';
import { cn, toCapitalize } from '@/lib/utils';
import { CheckCircleIcon, ClockIcon, LoaderCircleIcon, OctagonAlert } from 'lucide-react';

type StatusType = 'pending' | 'approved' | 'rejected';

interface StatusBadgeProps {
    type: StatusType;
    label: string;
}

const statusMap: Record<
    StatusType,
    {
        bg: string;
        text: string;
        border: string;
        icon: React.ElementType;
    }
> = {
    pending: {
        bg: 'bg-amber-600/10 dark:bg-amber-600/20 hover:bg-amber-600/10',
        text: 'text-amber-500',
        border: 'border-amber-600/60',
        icon: ClockIcon,
    },
    rejected: {
        bg: 'bg-red-600/10 dark:bg-red-600/20 hover:bg-red-600/10',
        text: 'text-red-500',
        border: 'border-red-600/60',
        icon: OctagonAlert,
    },
    approved: {
        bg: 'bg-emerald-600/10 dark:bg-emerald-600/20 hover:bg-emerald-600/10',
        text: 'text-emerald-500',
        border: 'border-emerald-600/60',
        icon: CheckCircleIcon,
    },
};

export default function StatusBadge({ type, label }: StatusBadgeProps) {
    const { bg, text, border, icon: Icon } = statusMap[type] || statusMap.pending;

    return (
        <Badge className={cn('flex items-center gap-1.5 rounded-full shadow-none', bg, text, border)}>
            <Icon className="h-4 w-4" />
            {toCapitalize(label)}
        </Badge>
    );
}
