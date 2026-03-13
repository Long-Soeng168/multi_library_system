import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ImageOffIcon } from 'lucide-react';
import HoverButton from '../Button/HoverButton';
import SmallOverlayTopRightButton from '../Button/SmallOverlayTopRightButton';
const PROVINCES = [
    { id: 1, name: 'Phnom Penh', subtitle: '470 Libraries', image_url: '/assets/sample_images/provinces/phnom_penh.jpg' },
    { id: 2, name: 'Siem Reap', subtitle: '120 Libraries', image_url: '/assets/sample_images/provinces/siem_reap.jpg' },
    { id: 3, name: 'Battambang', subtitle: '90 Libraries', image_url: '/assets/sample_images/provinces/battambang.jpg' },
    { id: 4, name: 'Kampot', subtitle: '82 Libraries', image_url: '/assets/sample_images/provinces/kampot.jpg' },
];

export default function Feature5() {
    const { provincesData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {provincesData.map((item: any) => (
                    <Link href={`/libraries?province_code=${item?.code}`} key={item?.id} prefetch>
                        <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-xl">
                            <Avatar className="aspect-[4/3] w-full object-cover object-center transition-transform duration-300 group-hover:scale-115">
                                <AvatarImage className="object-cover" src={`/assets/images/locations/thumb/${item?.image}`} />
                                <AvatarFallback className="rounded-none">
                                    <ImageOffIcon className="text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>

                            {/* Overlay at bottom */}
                            <div className="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-gray-950/80 p-3 sm:p-4">
                                <p className="text-base font-bold break-words whitespace-normal text-white drop-shadow-sm sm:text-xl">
                                    {currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}
                                </p>
                                {item?.libraries_count > 0 && (
                                    <p className="text-sm break-words whitespace-normal text-gray-100 sm:text-base">
                                        {item?.libraries_count} {t('Libraries')}
                                    </p>
                                )}
                            </div>

                            {/* Hover icon overlay (top-right with animation) */}
                            <SmallOverlayTopRightButton className="" iconSize={6} />
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-4 flex w-full justify-end">
                <Link href={`/libraries`}>
                    <HoverButton />
                </Link>
            </div>
        </>
    );
}
