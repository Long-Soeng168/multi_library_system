import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import CardHoverAnimateSlide from '../Card/CardHoverAnimateSlide';

const FUNDING_SOURCES = [
    {
        id: 1,
        title: 'Public funding',
        description: 'Funding provided by government or public institutions.',
        image_url: '/assets/icons/fundings/public_funding.png',
        link: '/funding/public',
    },
    {
        id: 2,
        title: 'Private funding',
        description: 'Funding provided by private companies or individuals.',
        image_url: '/assets/icons/fundings/private_funding.png',
        link: '/funding/private',
    },
    {
        id: 3,
        title: 'NGO funding',
        description: 'Funding provided by NGOs or non-profit organizations.',
        image_url: '/assets/icons/fundings/ngo_funding.png',
        link: '/funding/ngo',
    },
];

const Feature4 = () => {
    const { fundingTypes } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {fundingTypes.map((item: any) => (
                <Link href={`/libraries?source_of_funding_type_code=${item.code}`} key={item.id} prefetch>
                    <CardHoverAnimateSlide
                        title={currentLocale === 'kh' ? item?.name_kh || item?.name : item?.name}
                        description={currentLocale === 'kh' ? item?.short_description_kh || item?.short_description : item?.short_description}
                        image_url={`/assets/images/types/thumb/${item.image}`}
                    />
                </Link>
            ))}
        </div>
    );
};

export default Feature4;
