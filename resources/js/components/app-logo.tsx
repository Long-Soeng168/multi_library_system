import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { name, user_library, auth } = usePage<any>().props;
    return (
        <>
            <div className="flex aspect-square size-10 shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-transparent">
                {user_library?.image ? (
                    <img
                        src={`/assets/images/libraries/thumb/${user_library?.image}`}
                        alt="Logo"
                        className="h-full w-full bg-transparent object-contain"
                    />
                ) : (
                    <img src="/icon512_maskable.png" alt="Application Logo" className="h-full w-full bg-transparent object-contain" />
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                {user_library?.name ? (
                    <div className="flex w-full min-w-0 flex-col gap-0.5 overflow-hidden">
                        <div className="flex min-w-0 items-center gap-2">
                            {/* Library Name: Grows but truncates if it hits the badge */}
                            <span title={user_library?.name} className="min-w-0 truncate font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {user_library?.name}
                            </span>

                            {/* Role Badge: Stays fixed size, won't shrink */}
                            <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20 ring-inset">
                                {auth?.user?.library_role}
                            </span>
                        </div>

                        {/* User Name: Will truncate with "..." if too long */}
                        <p title={name} className="min-w-0 truncate text-xs font-medium text-muted-foreground/80">
                            {name}
                        </p>
                    </div>
                ) : (
                    <span className="mb-0.5 truncate leading-tight font-semibold">{name}</span>
                )}
            </div>
        </>
    );
}
