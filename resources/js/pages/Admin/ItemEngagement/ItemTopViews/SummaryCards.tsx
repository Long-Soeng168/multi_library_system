import { usePage } from '@inertiajs/react';
import { BarChart3, Monitor, Smartphone } from 'lucide-react';

const SummaryCards = () => {
    const { summary } = usePage<any>().props;

    const total = summary?.total_views ?? 0;

    const getPercentage = (value: number) => {
        if (!total || total === 0) return '0';
        return ((value / total) * 100).toFixed(1);
    };

    const stats = [
        {
            label: 'Total Views',
            value: total,
            percent: 100,
            description: 'All traffic',
            icon: BarChart3,
            border: 'border-blue-500/50',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500', // Explicit BG class for Tailwind
            gradient: 'from-blue-500/20 via-transparent to-transparent',
            showProgress: true,
        },
        {
            label: 'Desktop',
            value: summary?.desktop_views ?? 0,
            percent: getPercentage(summary?.desktop_views ?? 0),
            description: 'Desktop traffic',
            icon: Monitor,
            border: 'border-emerald-500/50',
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500',
            gradient: 'from-emerald-500/20 via-transparent to-transparent',
            showProgress: true,
        },
        {
            label: 'Mobile',
            value: summary?.mobile_views ?? 0,
            percent: getPercentage(summary?.mobile_views ?? 0),
            description: 'Mobile traffic',
            icon: Smartphone,
            border: 'border-orange-500/50',
            color: 'text-orange-500',
            bgColor: 'bg-orange-500',
            gradient: 'from-orange-500/20 via-transparent to-transparent',
            showProgress: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-3">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:border-primary/20 dark:hover:border-primary/40"
                >
                    {/* Background Gradient Accent */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-40`} />

                    <div className="relative z-10 flex h-full flex-col space-y-4">
                        <div className="flex items-center justify-between">
                            <div
                                className={`rounded-sm border bg-background p-2.5 transition-transform duration-300 group-hover:scale-105 ${stat.color} ${stat.border} dark:bg-zinc-950`}
                            >
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[12px] font-semibold text-muted-foreground uppercase opacity-80">{stat.label}</p>
                            <h3 className="text-3xl font-black text-foreground tabular-nums">{stat.value.toLocaleString()}</h3>
                        </div>

                        <div className="mt-auto pt-2">
                            {stat.showProgress ? (
                                <div className="space-y-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-[12px] font-medium text-muted-foreground">{stat.description}</span>
                                        <span className={`text-sm font-semibold tabular-nums ${stat.color}`}>{stat.percent}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full border border-border/50 bg-muted/30 dark:bg-muted/20">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${stat.bgColor}`}
                                            style={{ width: `${stat.percent}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 border-t border-border/40 pt-3">
                                    <div className={`h-1.5 w-1.5 animate-pulse rounded-full ${stat.bgColor}`} />
                                    <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">{stat.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SummaryCards;
