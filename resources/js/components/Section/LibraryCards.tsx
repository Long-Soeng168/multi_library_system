import useTranslation from '@/hooks/use-translation';

const LibraryCards = () => {
    const { t } = useTranslation();

    const partners = [
        { name: 'RULE Library', href: 'https://rule-library.com/', img: '1771911771_1761142673_RULELogo2.webp' },
        { name: 'Beltie University Library', href: 'http://www.biuelibrary.com', img: '1771911983_images.webp' },
        { name: 'National Institute of Education Library', href: '#', img: '1771911866_Screenshot 2026-02-24 124333.webp' },
        { name: 'Studio Image-House of Photography', href: 'https://sihp.bannalai.com/', img: '1771911635_1771828244_icon512_maskable.webp' },
        { name: 'PUC Library', href: '#', img: '1771912187_logo-tran.webp' },
        { name: 'Vanda University Library', href: '#', img: '1771912286_1636353690538.webp' },
        { name: 'RAC Library', href: 'https://libraryrac.com/', img: '1771912354_1750759821_RAC_logo-removebg-preview.webp' },
        { name: 'CUS Library', href: '#', img: '1771912415_003-Logo CUS.webp' },
        { name: 'Buddhist Institute Library', href: 'https://budinst.gov.kh/', img: '1771912555_1759229272_logo.webp' },
    ];

    return (
        <section className="bg-white px-4 py-8 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-gray-950">
            <div className="mx-auto max-w-7xl">
                <p className="mb-6 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                    {t('Partner libraries using our services')}
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-9">
                    {partners.map((partner, idx) => (
                        <a
                            key={idx}
                            href={partner.href}
                            target={partner.href !== '#' ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-100 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                        >
                            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-1 transition-all group-hover:scale-110">
                                <img
                                    className="h-full w-full object-contain filter transition-all group-hover:grayscale-0 lg:grayscale"
                                    src={`/assets/images/banalai_library/${partner.img}`}
                                    alt={partner.name}
                                />
                            </div>
                            <h3 className="line-clamp-2 text-center text-[10px] leading-tight font-medium text-gray-600 transition-colors group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
                                {t(partner.name)}
                            </h3>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LibraryCards;
