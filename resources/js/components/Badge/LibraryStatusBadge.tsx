import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import { AlertCircle, Ban, CheckCircle2, HelpCircle, LucideIcon, Timer } from 'lucide-react';

interface Library {
    code: string;
    status: 'active' | 'in_review' | 'suspended' | 'expired' | string;
    name?: string;
}

const LibraryStatusBadge = () => {
    const { user_library } = usePage<{ user_library: Library }>().props;
    const { t } = useTranslation();

    if (!user_library?.code) return null;

    const status = user_library.status || 'default';

    // Config with Dark Mode support via utility classes
    const statusConfig: Record<
        string,
        {
            container: string;
            icon: LucideIcon;
            pulse: boolean;
            ring: string;
        }
    > = {
        active: {
            container:
                'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/20 dark:border-green-500/40 ring-green-500/20',
            ring: 'bg-green-500 dark:bg-green-400',
            icon: CheckCircle2,
            pulse: true,
        },
        in_review: {
            container:
                'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/40 ring-amber-500/20',
            ring: 'bg-amber-500 dark:bg-amber-400',
            icon: Timer,
            pulse: true,
        },
        suspended: {
            container:
                'bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/40 ring-rose-500/20',
            ring: 'bg-rose-500 dark:bg-rose-400',
            icon: AlertCircle,
            pulse: false,
        },
        expired: {
            container:
                'bg-slate-500/10 dark:bg-slate-400/10 text-slate-600 dark:text-slate-400 border-slate-500/20 dark:border-slate-400/30 ring-slate-400/20',
            ring: 'bg-slate-400 dark:bg-slate-500',
            icon: Ban,
            pulse: false,
        },
        rejected: {
            container:
                'bg-red-500/10 dark:bg-red-400/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-400/30 ring-red-400/20',
            ring: 'bg-red-400 dark:bg-red-500',
            icon: Ban,
            pulse: false,
        },
        default: {
            container:
                'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/40 ring-blue-500/20',
            ring: 'bg-blue-500 dark:bg-blue-400',
            icon: HelpCircle,
            pulse: false,
        },
    };

    const config = statusConfig[status] || statusConfig.default;
    const Icon = config.icon;
    const label = statusConfig[status] ? t(`${status}`) : t('unknown_status');

    return (
        <div
            className={`group relative h-9 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-500 ease-in-out active:scale-95 sm:text-[11px] ${config.container} `}
        >
            <div className="relative z-10 flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 stroke-[2.5px] drop-shadow-sm" />
                <span className="shrink-0 leading-none whitespace-nowrap">{label}</span>
            </div>
        </div>
    );
};

export default LibraryStatusBadge;
