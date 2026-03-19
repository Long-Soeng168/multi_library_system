import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import FormFileUpload from '@/components/Form/FormFileUpload';
import UploadedImage from '@/components/Form/UploadedImageDisplay';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import FormRadioStatus from '@/components/Input/FormRadioStatus';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LIBRARY_STATUS_OPTIONS } from '@/data/status-data';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface TypeForm {
    name: string;
    name_kh?: string;
    external_link?: string;
    order_index?: string;
    short_description?: string;
    short_description_kh?: string;
    image?: string | null;
    banner?: string | null;
    email?: string;
    phone?: string;
    website_url?: string;
    address?: string;
    map_link?: string;
    opening_hours?: string;
    opening_days?: string;
    status: string;
    owner_id?: string;
}

export default function Create({ users, editData, readOnly }: { users: any[]; editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const [files, setFiles] = useState<File[] | null>(null); // For Thumbnail
    const [bannerFiles, setBannerFiles] = useState<File[] | null>(null); // For Banner

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<TypeForm>({
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        external_link: editData?.external_link || '',
        order_index: editData?.order_index || 100,
        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',
        image: editData?.image || null,
        banner: editData?.banner || null,
        email: editData?.email || '',
        phone: editData?.phone || '',
        website_url: editData?.website_url || 'https://',
        address: editData?.address || '',
        map_link: editData?.map_link || '',
        opening_hours: editData?.opening_hours || '',
        opening_days: editData?.opening_days || '',
        status: editData?.status || 'in_review',
        owner_id: editData?.owner_id || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({ ...data, image: files ? files[0] : null, banner: bannerFiles ? bannerFiles[0] : null }));

        if (editData?.id) {
            post(`/admin/libraries/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/libraries', {
                onSuccess: (page: any) => {
                    reset();
                    setFiles(null);
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Libraries', href: '/admin/libraries' },
        { title: editData?.name || 'Create', href: '#' },
    ];

    const { t, currentLocale } = useTranslation();
    const hasPermission = usePermission();
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
                    <div className="form-field-container md:grid-cols-1">
                        <FormField
                            id="name_kh"
                            name="name_kh"
                            label="Name Khmer"
                            value={data.name_kh}
                            onChange={(val) => setData('name_kh', val)}
                            error={errors.name_kh}
                        />

                        <FormFieldTextArea
                            id="short_description_kh"
                            name="short_description_kh"
                            label="Short Description Khmer"
                            value={data.short_description_kh}
                            onChange={(val) => setData('short_description_kh', val)}
                            error={errors.short_description_kh}
                        />
                    </div>
                ) : (
                    <>
                        {users?.length > 0 && (
                            <>
                                <FormCombobox
                                    name="owner_id"
                                    label="Owner"
                                    options={[
                                        {
                                            value: null,
                                            label: t(`NA`),
                                        },
                                        ...users.map((item: any) => ({
                                            value: item.id,
                                            label: `ID: ${item?.id} - ${item?.name} ${item?.phone ? '(' + item?.phone + ')' : ''}`,
                                        })),
                                    ]}
                                    value={data.owner_id || ''}
                                    onChange={(val) => setData('owner_id', val)}
                                    error={errors.owner_id}
                                />
                                {editData?.owner_id && editData?.owner_id != data.owner_id && (
                                    <div className="mt-2 flex items-start gap-3 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-900/20 dark:text-yellow-500">
                                        {/* Lucide AlertTriangle Icon */}
                                        <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />

                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-yellow-900 dark:text-yellow-400">{t('Ownership Change Notice')}</span>
                                            <span>
                                                {t(
                                                    'Warning: You are about to change the library owner. This action may restrict the previous owner’s access.',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
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
                            {hasPermission('item create') && (
                                <>
                                    <FormField
                                        id="external_link"
                                        name="external_link"
                                        label="External Link"
                                        value={data.external_link}
                                        onChange={(val) => setData('external_link', val)}
                                        error={errors.external_link}
                                        description="For Library use as Link only."
                                    />
                                    <FormField
                                        required
                                        type="number"
                                        id="order_index"
                                        name="order_index"
                                        label="Order Index"
                                        value={data.order_index}
                                        onChange={(val) => setData('order_index', val)}
                                        error={errors.order_index}
                                        description="Lower number has higher priority."
                                    />
                                </>
                            )}
                            <FormFieldTextArea
                                id="short_description"
                                name="short_description"
                                label="Short Description"
                                value={data.short_description}
                                onChange={(val) => setData('short_description', val)}
                                error={errors.short_description}
                                containerClassName="col-span-2"
                            />

                            <div className="col-span-2 grid gap-6 md:grid-cols-2">
                                <div>
                                    <FormFileUpload key={editData?.image} id="image" label="Logo" files={files} setFiles={setFiles} />
                                    {editData?.image && (
                                        <UploadedImage label="Uploaded Logo" images={editData?.image} basePath="/assets/images/libraries/thumb/" />
                                    )}
                                </div>
                                <div>
                                    <FormFileUpload id="banner" label="Banner" files={bannerFiles} setFiles={setBannerFiles} />
                                    {editData?.banner && (
                                        <UploadedImage label="Current Banner" images={editData?.banner} basePath="/assets/images/libraries/" />
                                    )}
                                </div>
                            </div>

                            {/* Contact Section */}
                            <FormField
                                id="email"
                                name="email"
                                label="Email"
                                value={data.email}
                                onChange={(val) => setData('email', val)}
                                error={errors.email}
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
                                id="website_url"
                                name="website_url"
                                label="Website URL"
                                value={data.website_url}
                                onChange={(val) => setData('website_url', val)}
                                error={errors.website_url}
                                containerClassName="col-span-2"
                                description="Example: <u>https://bannalai.com</u>"
                            />

                            {/* Location Section */}
                            <FormField
                                id="address"
                                name="address"
                                label="Address"
                                value={data.address}
                                onChange={(val) => setData('address', val)}
                                error={errors.address}
                                containerClassName="col-span-2"
                            />
                            <FormField
                                id="map_link"
                                name="map_link"
                                label="Map Link (Embed or URL)"
                                value={data.map_link}
                                onChange={(val) => setData('map_link', val)}
                                error={errors.map_link}
                                containerClassName="col-span-2"
                            />

                            {/* Operational Section */}
                            <FormField
                                id="opening_days"
                                name="opening_days"
                                label="Opening Days (e.g. Mon-Fri)"
                                value={data.opening_days}
                                onChange={(val) => setData('opening_days', val)}
                                error={errors.opening_days}
                            />
                            <FormField
                                id="opening_hours"
                                name="opening_hours"
                                label="Opening Hours (e.g. 8:00 AM - 5:00 PM)"
                                value={data.opening_hours}
                                onChange={(val) => setData('opening_hours', val)}
                                error={errors.opening_hours}
                            />

                            {/* Status Selector - Ensure your UI kit has a Select component or use raw HTML */}
                        </div>
                        <div>
                            <FormRadioStatus
                                name="status"
                                label={t('Status')}
                                options={LIBRARY_STATUS_OPTIONS.map((item) => ({
                                    value: item.value,
                                    label: t(item.label),
                                    // description: t(item.description),
                                }))}
                                value={data.status || 'in_review'}
                                onChange={(val) => setData('status', val)}
                                error={errors.status}
                                radioGroupClassName="grid-cols-4 max-w-full"
                            />
                        </div>
                    </>
                )}

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
