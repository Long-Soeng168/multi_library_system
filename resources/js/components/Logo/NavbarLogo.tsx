import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';

export function NavbarLogo() {
    const { website_info } = usePage<any>().props;
    const { currentLocale } = useTranslation();

    const logo = website_info?.logo ? `/assets/images/website_infos/thumb/${website_info.logo}` : '/assets/images/default-logo.png';

    const logoDark = website_info?.logo_darkmode ? `/assets/images/website_infos/thumb/${website_info.logo_darkmode}` : logo;

    const name = currentLocale === 'kh' ? website_info?.name_kh || website_info?.name : website_info?.name;

    const description =
        currentLocale === 'kh' ? website_info?.short_description_kh || website_info?.short_description : website_info?.short_description;

    return (
        <Link href={`/`}>
            <div className="flex items-center gap-4">
                <Avatar className="size-18">
                    <AvatarImage src={logo} alt={name || 'Logo'} className="rounded-full dark:hidden" />
                    <AvatarImage src={logoDark} alt={name || 'Logo'} className="hidden rounded-full dark:block" />
                    <AvatarFallback>{name?.charAt(0) || 'L'}</AvatarFallback>
                </Avatar>
                {/* <div className="flex flex-col">
                    {name && <p className="text-xl leading-tight font-semibold text-foreground md:text-2xl">{name}</p>}
                </div> */}
            </div>
        </Link>
    );
}
