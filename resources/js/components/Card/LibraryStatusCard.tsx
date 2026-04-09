import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, ArrowRight, Ban, CheckCircle2, ExternalLink, HelpCircle, MessageCircle, ShieldAlert, Timer } from 'lucide-react';

const LibraryStatusCard = () => {
    const { props, url } = usePage<any>();
    const { user_library } = props;
    const { t } = useTranslation();

    if (!user_library?.code) return null;

    const status = user_library.status || 'default';

    // 2. Add the specific condition for 'active' and '/dashboard'
    if (status === 'active' && url !== '/dashboard') {
        return null;
    }

    const isActive = status === 'active';

    const statusMap: Record<string, any> = {
        active: {
            icon: CheckCircle2,
            theme: 'green',
            label: t('Active'),
            description: t('Your library is live and visible to the public.'),
        },
        in_review: {
            icon: Timer,
            theme: 'amber',
            label: t('In Review'),
            description: t('Verifying your details. Usually takes 24-48h.'),
        },
        suspended: {
            icon: ShieldAlert,
            theme: 'rose',
            label: t('Suspended'),
            description: t('Access restricted due to policy violation.'),
        },
        expired: {
            icon: Ban,
            theme: 'slate',
            label: t('Expired'),
            description: t('Your subscription has ended. Access is limited.'),
        },
        rejected: {
            icon: AlertCircle,
            theme: 'red',
            label: t('Rejected'),
            description: t('Application did not meet our requirements.'),
        },
        default: {
            icon: HelpCircle,
            theme: 'blue',
            label: t('Unknown'),
            description: t('We are updating your library status.'),
        },
    };

    const config = statusMap[status] || statusMap.default;
    const Icon = config.icon;

    // Theme logic to keep the JSX clean
    const themes: Record<string, string> = {
        green: 'border-emerald-500/20 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-500/5 dark:text-emerald-400',
        amber: 'border-amber-500/20 bg-amber-50/50 text-amber-700 dark:bg-amber-500/5 dark:text-amber-400',
        rose: 'border-rose-500/20 bg-rose-50/50 text-rose-700 dark:bg-rose-500/5 dark:text-rose-400',
        red: 'border-red-500/20 bg-red-50/50 text-red-700 dark:bg-red-500/5 dark:text-red-400',
        slate: 'border-slate-500/20 bg-slate-50/50 text-slate-700 dark:bg-slate-500/5 dark:text-slate-400',
        blue: 'border-blue-500/20 bg-blue-50/50 text-blue-700 dark:bg-blue-500/5 dark:text-blue-400',
    };

    const currentTheme = themes[config.theme] || themes.blue;

    return (
        <div className={`group relative m-2 overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ${currentTheme}`}>
            {/* Ambient Background Glow */}
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-current opacity-[0.03] blur-3xl transition-opacity group-hover:opacity-[0.08]" />

            <div className="relative z-10 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Icon Hexagon/Circle Wrapper */}
                        <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-current/20 bg-white/50 dark:bg-black/20`}
                        >
                            <Icon className="h-6 w-6" strokeWidth={2} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-widest uppercase opacity-60">{t('Library Status')}</span>
                                {status === 'in_review' && (
                                    <span className="flex h-2 w-2">
                                        <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                                    </span>
                                )}
                            </div>
                            <h3 className="text-lg font-bold tracking-tight">{config.label}</h3>
                        </div>
                    </div>

                    {!isActive ? (
                        <Link
                            href="/contact"
                            className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition-all hover:bg-slate-50 active:scale-95 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
                        >
                            <MessageCircle size={16} />
                            {t('Get Help')}
                            <ArrowRight size={14} className="opacity-40" />
                        </Link>
                    ) : (
                        <a
                            target="_blank"
                            href={`/libraries/${user_library.id}`}
                            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95"
                        >
                            <ExternalLink size={16} />
                            {t('View Public Page')}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LibraryStatusCard;
