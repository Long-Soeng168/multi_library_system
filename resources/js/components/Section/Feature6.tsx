import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';

const statsData = [
    {
        id: 2,
        title: '2M+',
        description: 'Millions+ of reads across our Resources',
    },
    {
        id: 3,
        title: '200K+',
        description: 'More than two hundred thousand Resources downloads.',
    },
    {
        id: 4,
        title: '20K+',
        description: 'Over twenty thousand visitors at our physical library each year',
    },
    {
        id: 1,
        title: '4K+',
        description: 'Over four thousand books ready for you to read or download anytime.',
    },
];

const Feature6 = () => {
    const { keyValueData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <div className="mt-10">
            <div className="grid grid-cols-2 justify-center gap-x-10 gap-y-16 lg:grid-cols-4">
                {keyValueData?.map((stat: any, idx: number) => {
                    const name = currentLocale === 'kh' ? stat?.name_kh || stat?.name : stat?.name;
                    const shortDescription = currentLocale === 'kh' ? stat?.short_description_kh || stat?.short_description : stat?.short_description;

                    return (
                        <div key={idx} className="flex flex-col">
                            {/* Scaled from 4xl on mobile to 6xl on desktop */}
                            <span className="text-4xl font-bold tracking-tight text-primary md:text-6xl">{stat.value}</span>

                            {/* Scaled from base/lg on mobile to xl on desktop */}
                            {name && <p className="mt-3 text-base leading-tight font-semibold md:mt-6 md:text-xl">{name}</p>}

                            {/* Scaled from 14px on mobile to 17px on desktop */}
                            {shortDescription && (
                                <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground md:mt-2 md:text-[17px]">{shortDescription}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Feature6;
