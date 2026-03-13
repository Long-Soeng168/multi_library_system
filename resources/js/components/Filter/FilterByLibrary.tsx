import { FormCombobox } from '@/components/Input/FormCombobox';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const FilterByLibrary = () => {
    const hasPermission = usePermission();
    if (!hasPermission('item view')) return null;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const { libraries } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    const [selectedLibraryId, setSelectedLibraryId] = useState<string>('');

    const applyFilter = (libraryId: string) => {
        const params = new URLSearchParams();
        if (libraryId) {
            params.set('library_id', libraryId);
        }
        params.set('page', '1');

        router.get(
            `${currentPath}?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="flex items-center gap-2 overflow-x-scroll px-2 pb-2">
            <FormCombobox
                name="library_id"
                label={t('Library')}
                placeholder={t('Please select a library')}
                options={[
                    { value: '', label: t('All Libraries') },
                    ...libraries.map((lib: any) => ({
                        value: lib.id,
                        label: currentLocale === 'kh' ? lib.name_kh || lib.name : lib.name,
                    })),
                ]}
                value={selectedLibraryId}
                onChange={(val) => {
                    setSelectedLibraryId(val);
                    applyFilter(val);
                }}
                className="shrink-0"
            />
        </div>
    );
};

export default FilterByLibrary;
