import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { LogInIcon, UserRoundPlusIcon } from 'lucide-react';

const NavLogin = ({ hideRegisterWhenSmall }: { hideRegisterWhenSmall?: boolean }) => {
    return (
        <div className="flex items-center gap-3">
            <Link href={`/register`} prefetch className={`${hideRegisterWhenSmall && 'max-[450px]:hidden'}`}>
                <Button variant="ghost" className="inline-flex">
                    <UserRoundPlusIcon /> Register
                </Button>
            </Link>
            <Link href={`/login`} prefetch>
                <Button variant="ghost">
                    <LogInIcon /> Login
                </Button>
            </Link>
        </div>
    );
};

export default NavLogin;
