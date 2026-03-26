import { Link, usePage } from '@inertiajs/react';
import { ArrowUpCircle, Calendar, LayoutGrid, RotateCwIcon, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const UserActivePlan = () => {
    const { user_library, user_active_plan, locale } = usePage<any>().props;
    const isKhmer = locale === 'kh';

    if (!user_library?.id) return null;

    // --- Empty State (No Active Plan) ---
    if (!user_active_plan) {
        return (
            <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-card/30 p-8 text-center transition-all">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <LayoutGrid className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold tracking-tight text-foreground">{isKhmer ? 'មិនទាន់មានគម្រោង' : 'No Active Plan'}</h3>
                        <p className="mx-auto max-w-xs text-sm text-muted-foreground">
                            {isKhmer
                                ? 'ជ្រើសរើសគម្រោងណាមួយដើម្បីចាប់ផ្តើមប្រើប្រាស់មុខងារពេញលេញ។'
                                : 'Subscribe to a plan to unlock all features and start managing your library.'}
                        </p>
                    </div>
                    <Button asChild className="mt-2 font-semibold shadow-md transition-all active:scale-95">
                        <Link href="/pricing" className="flex items-center gap-2">
                            <Zap className="h-4 w-4 fill-current" />
                            {isKhmer ? 'មើលគម្រោងទាំងអស់' : 'View Pricing Plans'}
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // --- Active Plan View ---
    const plan = user_active_plan.plan;
    const isForever = plan.billing_cycle === 'forever';

    return (
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all dark:bg-card/50">
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

                {/* 2. Usage Summary */}
                <div className="grid grid-cols-2 gap-8 border-y border-border py-4 text-center md:border-x md:border-y-0 md:px-10 md:text-left">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Items Limit</p>
                        <p className="text-xl font-black text-foreground">{plan.max_books === -1 ? '∞' : plan.max_books.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Users Limit</p>
                        <p className="text-xl font-black text-foreground">{plan.max_members === -1 ? '∞' : plan.max_members.toLocaleString()}</p>
                    </div>
                </div>

                {/* 3. Date & Action */}
                <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Joined: {new Date(user_active_plan.started_at).toLocaleDateString()}</span>
                    </div>

                    <Button
                        asChild
                        size="sm"
                        variant={!isForever ? 'outline' : 'default'}
                        className="group font-semibold transition-all hover:shadow-md active:scale-95"
                    >
                        <Link href={!isForever ? `/subscribe-to-plan?plan_id=${plan?.id}` : '/pricing'} className="flex items-center gap-2">
                            {!isForever ? (
                                <RotateCwIcon className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180" />
                            ) : (
                                <ArrowUpCircle className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" />
                            )}
                            {!isForever ? (isKhmer ? 'បន្តគម្រោង' : 'Renew') : isKhmer ? 'តម្លើងកម្រិត' : 'Upgrade'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserActivePlan;
