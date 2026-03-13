import { MotionHighlight } from '@/components/animate-ui/effects/motion-highlight';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import SmallOverlayTopRightButton from '../Button/SmallOverlayTopRightButton';

import { FileCheckIcon, FileIcon, FileTextIcon, Microscope, Users } from 'lucide-react';

const data = [
    { code: '1', icon: FileTextIcon, name: 'គម្រោងឯកសារសេដ្ឋកិច្ច' },
    { code: '2', icon: FileCheckIcon, name: 'គម្រោងបទដ្ឋានគតិយុត្ត' },
    { code: '3', icon: FileIcon, name: 'ឯកសារផ្សេងៗ' },
    { code: '5', icon: Microscope, name: 'ឯកសារស្រាវជ្រាវ' },
    { code: '6', icon: Users, name: 'ASEAN University Network' },
];

export const Feature3Copy = () => {
    const [showAll, setShowAll] = useState(false);

    const { libraryTypes } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    // show 7 + "See All" card when collapsed
    // const visibleCards = showAll ? libraryTypes : libraryTypes.slice(0, 7);

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            <MotionHighlight hover className="rounded-xl">
                {data.map((item: any) => (
                    <Link href={`/resources/theses?major_code=${item.code}`} key={item.id} prefetch>
                        <div key={item.id} data-id={item.id} className="group relative h-full cursor-pointer">
                            <div className="flex h-full flex-col rounded-xl border p-4 transition-all duration-300 hover:border-primary hover:shadow-md">
                                {/* <TableCellAvatar
                                    className="flex size-10 items-center justify-center rounded-md border-none bg-primary/10"
                                    imageClassName="object-contain p-1"
                                    altTextClassName="text-primary rounded-none bg-primary/5"
                                    image={`/assets/images/types/thumb/${item.image}`}
                                    alt={currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}
                                /> */}
                                <span className="flex size-10 items-center justify-center rounded-md border-none bg-primary/5 text-primary hover:bg-primary/10">
                                    <item.icon />
                                </span>

                                <p className="mt-2 text-base font-medium">{currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}</p>

                                {/* Hover icon overlay (top-right with animation) */}
                                <SmallOverlayTopRightButton className="bg-primary/20 text-primary" iconSize={5} />
                            </div>
                        </div>
                    </Link>
                ))}
            </MotionHighlight>
        </div>
    );
};
