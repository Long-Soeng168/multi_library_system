import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { CircleCheckBigIcon, UserIcon } from 'lucide-react';

interface Role {
    name: string;
}

const FilterRole = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { roles } = usePage<{ roles: Role[] }>().props;

    // Get current role from URL
    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const activeRole = queryParams.get('role') || '';

    const handleRoleChange = (roleName: string) => {
        const newRole = roleName === activeRole ? '' : roleName;
        const newParams = new URLSearchParams(window.location.search);

        if (newRole) {
            newParams.set('role', newRole);
        } else {
            newParams.delete('role');
        }

        newParams.set('page', '1');

        router.get(
            `${currentPath}?${newParams.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getButtonClass = (isActive: boolean) => {
        const base = 'flex items-center gap-2 px-4 py-2 transition-all border text-sm rounded font-medium';

        // Shadcn UI Dark Mode compatible classes
        const activeStyles = 'border-primary whitespace-nowrap bg-primary/10 text-primary ring-1 ring-primary';
        const inactiveStyles = 'border-input whitespace-nowrap bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground';

        return `${base} ${isActive ? activeStyles : inactiveStyles}`;
    };
    const { t, currentLocale } = useTranslation();

    return (
        <div className="flex flex-row items-center gap-3 overflow-x-scroll p-2 pt-1">
            {/* "All" Option */}
            <button onClick={() => handleRoleChange('')} className={getButtonClass(activeRole === '')}>
                <CircleCheckBigIcon size={18} />
                <span>{t('All Roles')}</span>
            </button>

            {/* Dynamic Roles */}
            {roles.map((role) => (
                <button key={role.name} onClick={() => handleRoleChange(role.name)} className={getButtonClass(activeRole === role.name)}>
                    <UserIcon size={18} />
                    <span>{role.name}</span>
                </button>
            ))}
        </div>
    );
};

export default FilterRole;
