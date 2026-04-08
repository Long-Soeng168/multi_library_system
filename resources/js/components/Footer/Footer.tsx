import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { MailIcon, PhoneIcon } from 'lucide-react';
import SwitchDarkMode3D from '../Switch/SwitchDarkMode3D';

export default function Footer() {
    const { website_info, media_links } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    const { url } = usePage();

    const isActive = (href: string) => url === href || url.startsWith(href + '/');

    const quickLinks = [
        { href: '/', label: t('Home'), color: 'hover:text-yellow-400', dot: 'bg-yellow-400' },

        { href: '/products', label: t('Products'), color: 'hover:text-indigo-400', dot: 'bg-indigo-500' },

        { href: '/pricing', label: t('Pricing'), color: 'hover:text-green-400', dot: 'bg-green-500' },

        { href: '/about', label: t('About'), color: 'hover:text-blue-400', dot: 'bg-blue-500' },

        { href: '/support', label: t('Support'), color: 'hover:text-purple-400', dot: 'bg-purple-500' },

        { href: '/contact', label: t('Contact'), color: 'hover:text-pink-400', dot: 'bg-pink-500' },
    ];

    const tools: any[] = [
        // { href: '/barcode-generator', icon: <BarcodeIcon size={16} />, label: t('Barcode Generator') },
        // { href: '/qr-code-generator', icon: <QrCodeIcon size={16} />, label: t('QR Code Generator') },
    ];

    return (
        <footer className="border-t border-gray-800 bg-[linear-gradient(140deg,#101828,#1e2939,#101828)] text-gray-300 dark:bg-black dark:bg-none">
            <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <div className="mb-6 flex items-center space-x-3">
                            {/* <FooterLogo /> */}
                            <img alt="Logo" className="h-10 w-auto" src={`/assets/images/website_infos/thumb/${website_info.logo}`} />
                            <span className="text-2xl font-bold text-white">
                                {currentLocale === 'kh' ? website_info?.name_kh || website_info?.name : website_info?.name}
                            </span>
                        </div>
                        <p className="mb-6 max-w-md leading-relaxed text-gray-400">
                            {currentLocale === 'kh'
                                ? website_info?.short_description_kh || website_info?.short_description
                                : website_info?.short_description}
                        </p>
                        <div className="flex gap-2">
                            {media_links?.map((item: any) => (
                                <a
                                    key={item.id}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-700 transition-colors hover:bg-indigo-600"
                                >
                                    <img alt={item.name} className="h-7 w-7 object-contain" src={`/assets/images/links/thumb/${item.image}`} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links & Tools */}
                    <div>
                        <h4 className="mb-6 text-lg font-semibold text-white">{t('Quick Links')}</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className={`group flex items-center transition-colors ${isActive(link.href) ? 'text-yellow-400' : `text-gray-400 ${link.color}`}`}
                                    >
                                        <span
                                            className={`mr-2 h-1.5 w-1.5 rounded-full transition-opacity ${link.dot} ${isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                        ></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {tools?.length > 0 && (
                            <div className="mt-8">
                                <h4 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase">{t('Our Tools')}</h4>
                                <ul className="space-y-2">
                                    {tools?.map((tool, idx) => (
                                        <li key={idx}>
                                            <Link
                                                href={tool.href}
                                                className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
                                            >
                                                {tool.icon} {tool.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-6 text-lg font-semibold text-white">{t('Get in Touch')}</h4>
                        <ul className="space-y-4">
                            {website_info?.email && (
                                <li className="flex items-start">
                                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-yellow-500">
                                        <MailIcon className="h-5 w-5 text-gray-900" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">{t('Email')}</p>
                                        <a href={`mailto:${website_info.email}`} className="text-white transition-colors hover:text-indigo-400">
                                            {website_info.email}
                                        </a>
                                    </div>
                                </li>
                            )}
                            {website_info?.phone && (
                                <li className="flex items-start">
                                    <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-600">
                                        <PhoneIcon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">{t('Phone')}</p>
                                        <a href={`tel:${website_info.phone}`} className="text-white transition-colors hover:text-indigo-400">
                                            {website_info.phone}
                                        </a>
                                    </div>
                                </li>
                            )}
                        </ul>
                        <div className="mt-6">
                            <SwitchDarkMode3D />
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                            <p
                                className="text-sm text-gray-400"
                                dangerouslySetInnerHTML={{
                                    __html: currentLocale === 'kh' ? website_info?.copyright_kh || website_info?.copyright : website_info?.copyright,
                                }}
                            />
                            <p className="text-sm text-gray-500">
                                {t('Powered By')}:{' '}
                                <a href="https://www.alphalib.org" target="_blank" className="font-semibold text-yellow-400 hover:text-yellow-300">
                                    Alphalib
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-6 text-sm">
                            <Link href="/pages/privacy-policy" className="text-gray-400 transition-colors hover:text-green-400">
                                {t('Privacy Policy')}
                            </Link>
                            <Link href="/pages/terms-of-service" className="text-gray-400 transition-colors hover:text-yellow-400">
                                {t('Terms of Service')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
