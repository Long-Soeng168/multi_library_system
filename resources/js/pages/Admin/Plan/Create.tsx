import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { FormLabel } from '@/components/Input/FormLabel';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import MyCkeditor5 from '@/pages/plugins/ckeditor5/my-ckeditor5';
import { BreadcrumbItem } from '@/types';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const { t } = useTranslation();

    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const [inputLanguage, setInputLanguage] = useState<'default' | 'khmer'>('default');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: editData?.name || '',
        name_kh: editData?.name_kh || '',
        billing_cycle_label: editData?.billing_cycle_label || '',
        billing_cycle_label_kh: editData?.billing_cycle_label_kh || '',

        price: editData?.price || '',
        billing_cycle: editData?.billing_cycle || '',

        max_books: editData?.max_books ?? '',
        max_members: editData?.max_members ?? '',
        max_storage_mb: editData?.max_storage_mb ?? '',

        is_popular: editData?.is_popular || false,
        order_index: editData?.order_index || 100,

        button_label: editData?.button_label || '',
        button_label_kh: editData?.button_label_kh || '',
        action_url: editData?.action_url || '',

        short_description: editData?.short_description || '',
        short_description_kh: editData?.short_description_kh || '',
        long_description: editData?.long_description || '',
        long_description_kh: editData?.long_description_kh || '',
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editData?.id) {
            post(`/admin/plans/${editData.id}/update`, {
                onSuccess: (page: any) => {
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        } else {
            post('/admin/plans', {
                onSuccess: (page: any) => {
                    reset();
                    setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Plans', href: '/admin/plans' },
        { title: editData?.name || 'Create', href: '#' },
    ];

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

                {/* Language Tabs */}
                <Tabs value={inputLanguage} onValueChange={(val: any) => setInputLanguage(val)}>
                    <TabsList>
                        <TabsTrigger value="default">{t('Default')}</TabsTrigger>
                        <TabsTrigger value="khmer">{t('Khmer')}</TabsTrigger>
                    </TabsList>
                </Tabs>

                {inputLanguage === 'khmer' ? (
                    <div className="form-field-container md:grid-cols-1">
                        <FormField
                            id="name_kh"
                            name="name_kh"
                            label="Name Khmer"
                            value={data.name_kh}
                            onChange={(val) => setData('name_kh', val)}
                            error={errors.name_kh}
                            containerClassName="col-span-2"
                        />
                        <FormField
                            id="billing_cycle_label_kh"
                            name="billing_cycle_label_kh"
                            label="Billing Cycle Label Khmer"
                            value={data.billing_cycle_label_kh}
                            onChange={(val) => setData('billing_cycle_label_kh', val)}
                            error={errors.billing_cycle_label_kh}
                            containerClassName="col-span-2"
                        />

                        <FormField
                            id="button_label_kh"
                            name="button_label_kh"
                            label="Button Label Khmer"
                            value={data.button_label_kh}
                            onChange={(val) => setData('button_label_kh', val)}
                            containerClassName="col-span-2"
                        />
                        <FormFieldTextArea
                            id="short_description_kh"
                            name="short_description_kh"
                            label="Description Khmer"
                            value={data.short_description_kh}
                            onChange={(val) => setData('short_description_kh', val)}
                            error={errors.short_description_kh}
                            containerClassName="col-span-2"
                        />

                        <div className="col-span-2 grid content-start gap-2">
                            <FormLabel label="Long Description Khmer" />
                            <MyCkeditor5 data={data.long_description_kh || ''} setData={(val: any) => setData('long_description_kh', val)} />
                        </div>
                    </div>
                ) : (
                    <div className="form-field-container">
                        {/* Name */}
                        <FormField
                            id="name"
                            name="name"
                            required
                            label="Plan Name"
                            value={data.name}
                            onChange={(val) => setData('name', val)}
                            error={errors.name}
                        />

                        {/* Price */}
                        <FormField
                            id="price"
                            name="price"
                            type="number"
                            label="Price"
                            value={data.price}
                            onChange={(val) => setData('price', Number(val))}
                        />

                        <FormField
                            id="billing_cycle_label"
                            name="billing_cycle_label"
                            label="Billing Cycle Label"
                            value={data.billing_cycle_label}
                            onChange={(val) => setData('billing_cycle_label', val)}
                            error={errors.billing_cycle_label}
                        />

                        {/* Billing */}
                        <FormCombobox
                            name="billing_cycle"
                            label="Billing Cycle"
                            value={data.billing_cycle}
                            onChange={(val) => setData('billing_cycle', val)}
                            options={[
                                { value: '', label: 'None (Free)' },
                                { value: 'monthly', label: 'Monthly' },
                                { value: 'yearly', label: 'Yearly' },
                            ]}
                        />

                        {/* Limits */}
                        <FormField
                            id="max_books"
                            name="max_books"
                            type="number"
                            label="Max Books (-1 unlimited)"
                            value={data.max_books}
                            onChange={(val) => setData('max_books', Number(val))}
                        />

                        <FormField
                            id="max_members"
                            name="max_members"
                            type="number"
                            label="Max Members (-1 unlimited)"
                            value={data.max_members}
                            onChange={(val) => setData('max_members', Number(val))}
                        />

                        <FormField
                            id="max_storage_mb"
                            name="max_storage_mb"
                            type="number"
                            label="Max Storage MB (-1 unlimited)"
                            value={data.max_storage_mb}
                            onChange={(val) => setData('max_storage_mb', Number(val))}
                        />

                        {/* Popular */}
                        <div className="flex items-center gap-3">
                            <Switch checked={data.is_popular} onCheckedChange={(val) => setData('is_popular', val)} />
                            <span>Popular Plan</span>
                        </div>

                        {/* Order */}
                        <FormField
                            id="order_index"
                            name="order_index"
                            type="number"
                            label="Order"
                            value={data.order_index}
                            onChange={(val) => setData('order_index', Number(val))}
                        />

                        {/* Button */}
                        <FormField
                            id="button_label"
                            name="button_label"
                            label="Button Label"
                            value={data.button_label}
                            onChange={(val) => setData('button_label', val)}
                        />

                        <FormField
                            id="action_url"
                            name="action_url"
                            label="Action URL"
                            value={data.action_url}
                            onChange={(val) => setData('action_url', val)}
                        />

                        {/* Description */}
                        <FormFieldTextArea
                            id="short_description"
                            name="short_description"
                            label="Short Description"
                            value={data.short_description}
                            onChange={(val) => setData('short_description', val)}
                            containerClassName="col-span-2"
                        />
                        <div className="col-span-2 grid content-start gap-2">
                            <FormLabel label="Long Description" />
                            <MyCkeditor5 data={data.long_description || ''} setData={(val: any) => setData('long_description', val)} />
                        </div>
                    </div>
                )}

                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
