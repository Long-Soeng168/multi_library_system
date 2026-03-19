import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { Head, usePage } from '@inertiajs/react';
import { ArrowUpRight, Clock, Mail, MapPin, MessageSquareQuote, Phone } from 'lucide-react';

const Contact = () => {
    const { website_info } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const title = t('Contact Us');
    const description = website_info?.contact_description || t('Connect with us for inquiries, support, or collaboration opportunities.');

    return (
        <FrontPageLayout>
            <Head title={title} />

            <div className="relative min-h-[60vh] overflow-hidden bg-background py-12 transition-colors duration-300 lg:py-16">
                <div className="section-container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold text-primary shadow-sm">
                            <MessageSquareQuote size={12} strokeWidth={3} />
                            {t('Contact Us')}
                        </div>
                        {/* Changed text-slate-900 to text-foreground */}
                        <h1 className="mt-4 text-4xl font-black tracking-tight text-foreground sm:text-6xl">
                            {t('Get in')} <span className="text-primary">Touch</span>
                        </h1>
                        {/* Changed text-slate-600/80 to text-muted-foreground */}
                        <p className="mt-4 text-base font-medium text-muted-foreground md:text-lg">{description}</p>
                    </div>

                    {/* Contact Info Cards Grid */}
                    <div className="mt-16">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <ContactInfoCard
                                icon={<Mail size={24} />}
                                title={t('Email')}
                                value={website_info?.email}
                                link={`mailto:${website_info?.email}`}
                                label={t('Write to us')}
                            />
                            <ContactInfoCard
                                icon={<Phone size={24} />}
                                title={t('Phone Number')}
                                value={website_info?.phone}
                                link={`tel:${website_info?.phone}`}
                                label={t('Call us directly')}
                            />
                            <ContactInfoCard
                                icon={<MapPin size={24} />}
                                title={t('Address')}
                                value={currentLocale === 'kh' ? website_info?.address_kh : website_info?.address}
                                label={t('Find us')}
                            />
                            <ContactInfoCard
                                icon={<Clock size={24} />}
                                title={t('Working Hours')}
                                value="Mon - Fri: 8AM - 5PM"
                                label={t('Availability')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            {website_info?.map_url && (
                <div className="relative h-[400px] w-full overflow-hidden border-t border-border bg-muted">
                    <div className="pointer-events-none absolute inset-0 z-10 shadow-[inset_0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_20px_40px_rgba(0,0,0,0.4)]" />
                    <iframe
                        src={website_info.map_url}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(0.2) invert(var(--map-invert, 0)) contrast(1.05)' }}
                        className="dark:[--map-invert:0.9]" // Optional: subtle invert for maps in dark mode
                        allowFullScreen
                        loading="lazy"
                        title={t('Our Location Map')}
                    />
                </div>
            )}
        </FrontPageLayout>
    );
};

/* Redesigned for Dark Mode Compatibility */
const ContactInfoCard = ({ icon, title, value, link, label }: any) => (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-white/60 bg-white/40 p-6 text-center shadow-lg shadow-slate-200/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/90 hover:shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10">
        {/* Hover Highlight Background */}
        <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-primary/5 transition-all duration-500 group-hover:scale-[3.5]" />

        {/* Icon Wrapper */}
        <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-500 group-hover:rotate-[8deg]">
            {icon}
        </div>

        {/* Text Content */}
        <span className="mb-1 text-[10px] font-bold text-primary/60 dark:text-primary/80">{label}</span>
        <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>

        {link ? (
            <a
                href={link}
                className="group/link flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary dark:hover:text-primary"
            >
                <span className="break-all">{value || '---'}</span>
                <ArrowUpRight size={14} className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
        ) : (
            <p className="text-sm font-semibold break-words text-muted-foreground">{value || '---'}</p>
        )}
    </div>
);

export default Contact;
