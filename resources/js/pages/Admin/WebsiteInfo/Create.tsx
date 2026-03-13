import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface WebsiteInfoForm {
    name: string;
    name_kh?: string;

    short_description?: string;
    short_description_kh?: string;

    keywords?: string;
    keywords_kh?: string;

    address?: string;
    address_kh?: string;

    google_map_embed?: string;

    phone?: string;
    email?: string;

    working_hours?: string;
    working_hours_kh?: string;

    working_days?: string;
    working_days_kh?: string;

    copyright?: string;
    copyright_kh?: string;

    logo?: string | null;
    logo_darkmode?: string | null;

    primary_color?: string | null;
    primary_foreground_color?: string | null;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { types } = usePage<any>().props;

    const [files, setFiles] = useState<File[] | null>(null);
    const [darkModefiles, setdarkModeFiles] = useState<File[] | null>(null);

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<WebsiteInfoForm>({
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',

        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',

        keywords: editData?.keywords || '',
        keywords_kh: editData?.keywords_kh || '',

        address: editData?.address || '',
        address_kh: editData?.address_kh || '',

        google_map_embed: editData?.google_map_embed || '',

        phone: editData?.phone || '',
        email: editData?.email || '',

        working_hours: editData?.working_hours || '',
        working_hours_kh: editData?.working_hours_kh || '',

        working_days: editData?.working_days || '',
        working_days_kh: editData?.working_days_kh || '',

        copyright: editData?.copyright || '',
        copyright_kh: editData?.copyright_kh || '',

        logo: editData?.logo || null,
        logo_darkmode: editData?.logo_darkmode || null,

        primary_color: editData?.primary_color || null,
        primary_foreground_color: editData?.primary_foreground_color || null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, logo: files ? files[0] : null, logo_darkmode: darkModefiles ? darkModefiles[0] : null }));

        if (editData?.id) {
            post(`/admin/website-infos/${editData.id}/update`, {
                preserveState: true,
                onSuccess: (page: any) => {
                    setFiles(null);
                    setdarkModeFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/website-infos', {
                // preserveState: false,
                onSuccess: (page: any) => {
                    // reset();
                    setFiles(null);
                    setdarkModeFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Website Info', href: '/admin/website-infos' },
        { title: editData?.name || 'Create', href: '#' },
    ];

    const { t, currentLocale } = useTranslation();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={onSubmit} className="form">
                <AlertFlashMessage
                    key={flashMessage.message}
                    type={flashMessage.type}
                    flashMessage={flashMessage.message}
                    setFlashMessage={setFlashMessage}
                />
                {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}

                <div className="sticky top-0">
                    <Tabs value={inputLanguage} onValueChange={(val: any) => setInputLanguage(val)}>
                        <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                            <TabsTrigger value="default" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Default')}
                            </TabsTrigger>
                            <TabsTrigger value="khmer" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Khmer')}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {inputLanguage == 'khmer' ? (
                    <div className="form-field-container">
                        <FormField
                            id="name_kh"
                            name="name_kh"
                            label="Name Khmer"
                            value={data.name_kh}
                            onChange={(val) => setData('name_kh', val)}
                            error={errors.name_kh}
                            containerClassName="col-span-2"
                        />

                        <FormFieldTextArea
                            id="short_description_kh"
                            name="short_description_kh"
                            label="Short Description Khmer"
                            value={data.short_description_kh}
                            onChange={(val) => setData('short_description_kh', val)}
                            error={errors.short_description_kh}
                        />

                        <FormFieldTextArea
                            id="address_kh"
                            name="address_kh"
                            label="Address Khmer"
                            value={data.address_kh}
                            onChange={(val) => setData('address_kh', val)}
                            error={errors.address_kh}
                        />

                        <FormField
                            id="keywords_kh"
                            name="keywords_kh"
                            label="SEO Keywords Khmer"
                            value={data.keywords_kh}
                            onChange={(val) => setData('keywords_kh', val)}
                            error={errors.keywords_kh}
                            containerClassName="col-span-2"
                        />

                        <FormField
                            id="working_hours_kh"
                            name="working_hours_kh"
                            label="Working Hours Khmer"
                            value={data.working_hours_kh}
                            onChange={(val) => setData('working_hours_kh', val)}
                            error={errors.working_hours_kh}
                        />

                        <FormField
                            id="working_days_kh"
                            name="working_days_kh"
                            label="Working Days Khmer"
                            value={data.working_days_kh}
                            onChange={(val) => setData('working_days_kh', val)}
                            error={errors.working_days_kh}
                        />

                        <FormField
                            id="copyright_kh"
                            name="copyright_kh"
                            label="Copyright Khmer"
                            value={data.copyright_kh}
                            onChange={(val) => setData('copyright_kh', val)}
                            error={errors.copyright_kh}
                        />
                    </div>
                ) : (
                    <div className="form-field-container">
                        <FormField
                            required
                            id="name"
                            name="name"
                            label="Name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                            containerClassName="col-span-2"
                        />

                        <FormFieldTextArea
                            id="short_description"
                            name="short_description"
                            label="Short Description"
                            value={data.short_description}
                            onChange={(val) => setData('short_description', val)}
                            error={errors.short_description}
                        />

                        <FormFieldTextArea
                            id="address"
                            name="address"
                            label="Address"
                            value={data.address}
                            onChange={(val) => setData('address', val)}
                            error={errors.address}
                        />

                        <FormField
                            id="keywords"
                            name="keywords"
                            label="SEO Keywords"
                            value={data.keywords}
                            onChange={(val) => setData('keywords', val)}
                            error={errors.keywords}
                            containerClassName="col-span-2"
                        />

                        <FormField
                            id="phone"
                            name="phone"
                            label="Phone"
                            value={data.phone}
                            onChange={(val) => setData('phone', val)}
                            error={errors.phone}
                        />

                        <FormField
                            id="email"
                            name="email"
                            label="Email"
                            value={data.email}
                            onChange={(val) => setData('email', val)}
                            error={errors.email}
                        />

                        <FormField
                            id="working_hours"
                            name="working_hours"
                            label="Working Hours"
                            value={data.working_hours}
                            onChange={(val) => setData('working_hours', val)}
                            error={errors.working_hours}
                        />

                        <FormField
                            id="working_days"
                            name="working_days"
                            label="Working Days"
                            value={data.working_days}
                            onChange={(val) => setData('working_days', val)}
                            error={errors.working_days}
                        />

                        <FormField
                            id="copyright"
                            name="copyright"
                            label="Copyright"
                            value={data.copyright}
                            onChange={(val) => setData('copyright', val)}
                            error={errors.copyright}
                        />

                        <div className="md:col-span-2">
                            <FormField
                                id="google_map_embed"
                                name="google_map_embed"
                                label="Google Map Embed"
                                value={data.google_map_embed}
                                onChange={(val) => setData('google_map_embed', val)}
                                error={errors.google_map_embed}
                            />
                        </div>

                        <FormField
                            type="color"
                            id="primary_color"
                            name="primary_color"
                            label="Primary Color"
                            value={data.primary_color || ''}
                            onChange={(val) => setData('primary_color', val)}
                            error={errors.primary_color}
                        />
                        <FormField
                            type="color"
                            id="primary_foreground_color"
                            name="primary_foreground_color"
                            label="Primary Foreground Color"
                            value={data.primary_foreground_color || ''}
                            onChange={(val) => setData('primary_foreground_color', val)}
                            error={errors.primary_foreground_color}
                        />

                        <div>
                            <FormFileUpload key={editData?.logo} id="logo" label="Logo" files={files} setFiles={setFiles} />
                            {editData?.logo && (
                                <UploadedImage label="Uploaded Logo" images={editData?.logo} basePath="/assets/images/website_infos/" />
                            )}
                        </div>

                        <div>
                            <FormFileUpload
                                key={editData?.logo_darkmode}
                                id="logo_darkmode"
                                label="Logo (Dark Mode)"
                                files={darkModefiles}
                                setFiles={setdarkModeFiles}
                            />
                            {editData?.logo_darkmode && (
                                <UploadedImage
                                    label="Uploaded Logo (Dark Mode)"
                                    images={editData?.logo_darkmode}
                                    basePath="/assets/images/website_infos/"
                                />
                            )}
                        </div>
                    </div>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
