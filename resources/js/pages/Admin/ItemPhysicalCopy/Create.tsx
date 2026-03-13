import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import { FormCombobox } from '@/components/Input/FormCombobox';
import { FormField } from '@/components/Input/FormField';
import { FormFieldTextArea } from '@/components/Input/FormFieldTextArea';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import { Button } from '@/components/ui/button';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';

// Koha Authorized Values for Flags
const NOT_FOR_LOAN_OPTIONS = [
    { label: 'Yes', label_kh: 'អាចខ្ចីបាន', value: '0' },
    { label: 'No', label_kh: 'មិនអាចខ្ចីបាន', value: '1' },
];

const ITEM_LOST_OPTIONS = [
    { label: 'Not Lost', label_kh: 'មិនបានបាត់', value: '0' },
    { label: 'Lost', label_kh: 'បានបាត់', value: '1' },
];

interface ItemPhysicalCopyForm {
    item_id: string | number;
    barcode: string;
    full_call_number: string;
    inventory_number: string;

    public_note: string;
    unpublic_note: string;

    shelf_location_code: string;
    item_type_code: string;
    home_library_code: string;
    current_library_code: string;

    not_for_loan: number;
    item_lost: number;
    withdrawn: number;
    damaged: number;
}

export default function Create({ editData, readOnly }: { editData?: any; readOnly?: boolean }) {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const hasPermission = usePermission();
    const { user_library, auth, itemRecord, itemTypes, shelfLocations, libraries } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const { data, setData, post, processing, transform, progress, errors, reset } = useForm<ItemPhysicalCopyForm>({
        item_id: editData?.item_id || itemRecord?.id || '',
        barcode: editData?.barcode || '',
        full_call_number: editData?.full_call_number || '',
        inventory_number: editData?.inventory_number || '',
        public_note: editData?.public_note || '',
        unpublic_note: editData?.unpublic_note || '',
        shelf_location_code: editData?.shelf_location_code || '',
        item_type_code: editData?.item_type_code || '',
        home_library_code: editData?.home_library_code || '',
        current_library_code: editData?.current_library_code || '',
        not_for_loan: editData?.not_for_loan || 0,
        item_lost: editData?.item_lost || 0,
        withdrawn: editData?.withdrawn || 0,
        damaged: editData?.damaged || 0,
    });

    const onSubmit = (e: React.FormEvent, stay: boolean = false) => {
        e.preventDefault();

        const url = editData?.id
            ? `/admin/items/${itemRecord?.id}/physical-copies/${editData.id}/update`
            : `/admin/items/${itemRecord?.id}/physical-copies`;

        post(url, {
            onSuccess: (page: any) => {
                setFlashMessage({ message: page.props.flash?.success, type: 'success' });

                if (!editData?.id) {
                    if (stay) {
                        // "Save and Copy": Reset only the unique identifiers
                        setData((prev) => ({
                            ...prev,
                            barcode: '',
                            inventory_number: '',
                        }));
                    } else {
                        // Standard Save: Full reset
                        reset();
                    }
                }
            },
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Items', href: hasPermission('item view') ? '/admin/items' : `/dashboard/library/${user_library?.code}/items` },
        {
            title: itemRecord?.name,
            href: hasPermission('item view')
                ? `/admin/items/${itemRecord?.id}?view_physical_copies=1`
                : `/dashboard/library/${user_library?.code}/items/${itemRecord?.id}?view_physical_copies=1`,
        },
        { title: editData?.id ? `${t('Edit Physical Copy')} (${t('Barcode')}: ${editData?.barcode})` : 'Add Physical Copy', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={onSubmit} className="form space-y-6">
                <AlertFlashMessage
                    key={flashMessage.message}
                    type={flashMessage.type}
                    flashMessage={flashMessage.message}
                    setFlashMessage={setFlashMessage}
                />
                {errors && Object.keys(errors).length > 0 && <AllErrorsAlert title="Please fix errors" errors={errors} />}

                {/* Identification Section */}
                <div className="form-field-container">
                    <FormField
                        id="barcode"
                        name="barcode"
                        required
                        label="Barcode"
                        value={data.barcode}
                        onChange={(val) => setData('barcode', val)}
                        error={errors.barcode}
                    />
                    {/* <FormField
                        id="inventory_number"
                        name="inventory_number"
                        label="Inventory Number"
                        value={data.inventory_number}
                        onChange={(val) => setData('inventory_number', val)}
                        error={errors.inventory_number}
                    /> */}
                    <FormField
                        id="full_call_number"
                        name="full_call_number"
                        label="Call Number"
                        value={data.full_call_number}
                        onChange={(val) => setData('full_call_number', val)}
                        error={errors.full_call_number}
                    />
                </div>

                {/* Classification & Location Section */}
                <div className="form-field-container">
                    <FormCombobox
                        required
                        name="item_type_code"
                        label="Item Type"
                        options={itemTypes?.map((i: any) => ({ value: i.code, label: currentLocale === 'kh' ? i.name_kh || i.name : i.name }))}
                        value={data.item_type_code}
                        onChange={(val) => setData('item_type_code', val)}
                        error={errors.item_type_code}
                    />
                    <FormCombobox
                        name="shelf_location_code"
                        label="Shelf Location"
                        options={[
                            {
                                value: null,
                                label: t('NA'),
                            },
                            ...shelfLocations?.map((i: any) => ({ value: i.code, label: currentLocale === 'kh' ? i.name_kh || i.name : i.name })),
                        ]}
                        value={data.shelf_location_code}
                        onChange={(val) => setData('shelf_location_code', val)}
                        error={errors.shelf_location_code}
                    />
                    {/* <FormCombobox
                        required
                        name="home_library_code"
                        label="Home Library"
                        options={libraries?.map((i: any) => ({ value: i.code, label: currentLocale === 'kh' ? i.name_kh || i.name : i.name }))}
                        value={data.home_library_code}
                        onChange={(val) => setData('home_library_code', val)}
                        error={errors.home_library_code}
                    />
                    <FormCombobox
                        required
                        name="current_library_code"
                        label="Current Library"
                        options={libraries?.map((i: any) => ({ value: i.code, label: currentLocale === 'kh' ? i.name_kh || i.name : i.name }))}
                        value={data.current_library_code}
                        onChange={(val) => setData('current_library_code', val)}
                        error={errors.current_library_code}
                    /> */}
                </div>

                {/* Koha Flags Section */}
                <div className="grid grid-cols-1 gap-4 rounded-lg border bg-gray-50 p-4 md:grid-cols-4 dark:bg-white/5">
                    <FormCombobox
                        name="not_for_loan"
                        label="Allow Checkout"
                        searchPlaceholder="Search..."
                        options={NOT_FOR_LOAN_OPTIONS.map((o) => ({ value: o.value, label: currentLocale === 'kh' ? o.label_kh : o.label }))}
                        value={data.not_for_loan.toString()}
                        onChange={(val) => setData('not_for_loan', parseInt(val))}
                    />
                    <FormCombobox
                        name="item_lost"
                        label="Lost"
                        searchPlaceholder="Search..."
                        options={ITEM_LOST_OPTIONS.map((o) => ({ value: o.value, label: currentLocale === 'kh' ? o.label_kh : o.label }))}
                        value={data.item_lost.toString()}
                        onChange={(val) => setData('item_lost', parseInt(val))}
                    />
                    <FormCombobox
                        name="damaged"
                        label="Damaged"
                        searchPlaceholder="Search..."
                        options={[
                            { label: 'No', value: '0' },
                            { label: 'Yes', value: '1' },
                        ]}
                        value={data.damaged.toString()}
                        onChange={(val) => setData('damaged', parseInt(val))}
                    />
                    <FormCombobox
                        name="withdrawn"
                        label="Withdrawn"
                        searchPlaceholder="Search..."
                        options={[
                            { label: 'No', value: '0' },
                            { label: 'Yes', value: '1' },
                        ]}
                        value={data.withdrawn.toString()}
                        onChange={(val) => setData('withdrawn', parseInt(val))}
                    />
                </div>

                {/* Notes Section */}
                <div className="form-field-container">
                    <FormFieldTextArea
                        id="public_note"
                        name="public_note"
                        label="Public Note"
                        value={data.public_note}
                        onChange={(val) => setData('public_note', val)}
                    />
                    <FormFieldTextArea
                        id="unpublic_note"
                        name="unpublic_note"
                        label="Unpublic Note"
                        value={data.unpublic_note}
                        onChange={(val) => setData('unpublic_note', val)}
                    />
                </div>

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                {!readOnly && (
                    <div className="flex justify-end gap-2">
                        {!editData?.id && (
                            <Button
                                disabled={processing}
                                type="button"
                                variant="outline"
                                onClick={(e) => onSubmit(e, true)}
                                className="h-11 border-primary px-6 dark:border-primary"
                            >
                                {processing && (
                                    <span className="mr-2 size-6 animate-spin">
                                        <LoaderCircleIcon />
                                    </span>
                                )}
                                {processing ? t('Saving') : t('Save and Copy')}
                            </Button>
                        )}

                        <Button disabled={processing} type="button" onClick={(e) => onSubmit(e, false)} className="h-11 px-6">
                            {processing && (
                                <span className="mr-2 size-6 animate-spin">
                                    <LoaderCircleIcon />
                                </span>
                            )}
                            {processing ? t('Saving') : t('Save')}
                        </Button>
                    </div>
                )}
            </form>
        </AppLayout>
    );
}
