import { Link, usePage } from '@inertiajs/react';
import { ArrowUpCircle, Calendar, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const UserActivePlan = () => {
    const { auth, user_active_plan, locale } = usePage<any>().props;
    console.log(user_active_plan);

    if (!user_active_plan) return null;

    const plan = user_active_plan.plan;
    const isKhmer = locale === 'kh';

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all dark:bg-card/50">
            {/* Subtle Gradient Glow - Using Shadcn primary color */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                {/* 1. Plan Identity */}
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-inner">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold tracking-tight text-foreground">{isKhmer && plan.name_kh ? plan.name_kh : plan.name}</h3>
                            <Badge
                                variant="secondary"
                                className="rounded-full bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                            >
                                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                                {user_active_plan.status.toUpperCase()}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {isKhmer && plan.billing_cycle_label_kh ? plan.billing_cycle_label_kh : plan.billing_cycle_label}
                        </p>
                    </div>
                </div>

                {/* 2. Usage Summary - Vertical Dividers on Desktop */}
                <div className="grid grid-cols-2 gap-8 border-y border-border py-4 md:border-x md:border-y-0 md:px-10">
                    <div className="space-y-1">
                        <p className="font-semibold text-muted-foreground">Books Limit</p>
                        <p className="text-xl font-black text-foreground">{plan.max_books === -1 ? '∞' : plan.max_books.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-muted-foreground">Users Limit</p>
                        <p className="text-xl font-black text-foreground">{plan.max_members === -1 ? '∞' : plan.max_members.toLocaleString()}</p>
                    </div>
                </div>

                {/* 3. Date & Action */}
                <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Joined: {new Date(user_active_plan.started_at).toLocaleDateString()}</span>
                    </div>

                    <Button asChild size="sm" className="font-semibold transition-all hover:shadow-lg active:scale-95">
                        <Link href="/pricing" className="flex items-center gap-2">
                            Upgrade
                            <ArrowUpCircle className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserActivePlan;
