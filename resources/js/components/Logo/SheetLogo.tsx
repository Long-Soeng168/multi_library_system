import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';

export function SheetLogo() {
    const { website_info } = usePage<any>().props;
    const { currentLocale } = useTranslation();

    const logo = website_info?.logo ? `/assets/images/website_infos/thumb/${website_info.logo}` : '/assets/images/default-logo.png';

    const logoDark = website_info?.logo_darkmode ? `/assets/images/website_infos/thumb/${website_info.logo_darkmode}` : logo;

    const name = currentLocale === 'kh' ? website_info?.name_kh || website_info?.name : website_info?.name;

    const description =
        currentLocale === 'kh' ? website_info?.short_description_kh || website_info?.short_description : website_info?.short_description;

    return (
        <Link href={`/`}>
            <div className="flex w-full flex-col flex-wrap items-center gap-4">
                <Avatar className="size-18">
                    <AvatarImage src={logo} alt={name || 'Logo'} className="rounded object-contain dark:hidden" />
                    <AvatarImage src={logoDark} alt={name || 'Logo'} className="hidden rounded object-contain dark:block" />
                    <AvatarFallback>{name?.charAt(0) || 'L'}</AvatarFallback>
                </Avatar>
                {/* <div className="flex flex-col items-center">
                    <div className="text-center whitespace-nowrap">
                        <p className="text-base font-medium whitespace-nowrap text-muted-foreground md:text-[16px]">គេហទំព័របណ្ណាល័យនៃ</p>
                        <p className="text-lg leading-tight font-bold text-foreground md:text-[20px]">សាកលវិទ្យាល័យភូមិន្ទនីតិសាស្ត្រ</p>
                        <p className="text-lg leading-tight font-bold text-foreground md:text-[20px]">និងវិទ្យាសាស្ត្រសេដ្ឋកិច្ច</p>
                        <p className="mt-1 text-sm leading-tight font-medium text-foreground md:text-[13px]">Royal University of Law and Economics</p>
                    </div>
                </div> */}
            </div>
        </Link>
    );
}
