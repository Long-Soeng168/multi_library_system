import { Alert, AlertTitle } from '@/components/ui/alert';
import { CircleCheckBigIcon, CircleFadingArrowUpIcon, OctagonAlert, ShieldAlert } from 'lucide-react';
import { ReactNode } from 'react';

type AlertType = 'success' | 'info' | 'warning' | 'error';

interface AlertStaticProps {
    type: AlertType;
    message: string;
    icon?: ReactNode;
}

const colorMap = {
    success: {
        bg: 'bg-emerald-600/10 dark:bg-emerald-600/15',
        text: 'text-emerald-500',
        border: 'border-emerald-500/50 dark:border-emerald-600/50',
        defaultIcon: <CircleCheckBigIcon className="mb-[3px]" />,
    },
    info: {
        bg: 'bg-blue-500/10 dark:bg-blue-600/20',
        text: 'text-blue-500 dark:text-blue-400',
        border: 'border-blue-400/50 dark:border-blue-600/60',
        defaultIcon: <CircleFadingArrowUpIcon className="mb-[3px]" />,
    },
    warning: {
        bg: 'bg-amber-600/10 dark:bg-amber-600/15',
        text: 'text-amber-500',
        border: 'border-amber-500/50 dark:border-amber-600/50',
        defaultIcon: <ShieldAlert className="mb-[3px]" />,
    },
    error: {
        bg: 'bg-destructive/10 dark:bg-destructive/15',
        text: 'text-destructive',
        border: 'border-destructive/30 dark:border-destructive/50',
        defaultIcon: <OctagonAlert className="mb-[3px]" />,
    },
};

export default function AlertStatic({ type, message, icon }: AlertStaticProps) {
    const { bg, text, border, defaultIcon } = colorMap[type] || colorMap.info;

    return (
        <Alert className={`${bg} ${text} ${border} flex items-center gap-2`}>
            {icon || defaultIcon}
            <AlertTitle>{message}</AlertTitle>
        </Alert>
    );
}
