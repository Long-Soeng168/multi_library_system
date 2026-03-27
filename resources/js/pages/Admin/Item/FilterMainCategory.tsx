import { FormCombobox } from '@/components/Input/FormCombobox';
import useTranslation from '@/hooks/use-translation';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const FilterMainCategory = () => {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    const { mainCategories, categories, subCategories, main_category_code, category_code } = usePage<any>().props;

    const { t, currentLocale } = useTranslation();

    const params = new URLSearchParams(window.location.search);
    const libraryId = params.get('library_id');

    const [selectedMainCategoryCode, setSelectedMainCategoryCode] = useState<string>(main_category_code || null);
    const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('');
    const [selectedSubCategoryCode, setSelectedSubCategoryCode] = useState<string>('');

    const resolveCategoryCode = (category?: string, sub?: string) => {
        return sub || category || '';
    };

    const applyFilter = (mainCode: string, categoryCode: string, subCategoryCode: string) => {
        const params = new URLSearchParams();

        // preserve library filter
        if (libraryId) {
            params.set('library_id', libraryId);
        }

        if (mainCode) {
            params.set('main_category_code', mainCode);
        }

        const finalCategoryCode = resolveCategoryCode(categoryCode, subCategoryCode);

        if (finalCategoryCode) {
            params.set('category_code', finalCategoryCode);
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

    // Optional: filter by library
    const filteredMainCategories = libraryId ? mainCategories?.filter((item: any) => String(item.library_id) === String(libraryId)) : mainCategories;

    const filteredCategories = categories?.filter(
        (item: any) => item.item_main_category_code === selectedMainCategoryCode && (!libraryId || String(item.library_id) === String(libraryId)),
    );

    const filteredSubCategories = subCategories?.filter(
        (item: any) => item.parent?.code === selectedCategoryCode && (!libraryId || String(item.library_id) === String(libraryId)),
    );

    return (
        <div>
            <div className="flex items-center gap-2 overflow-x-scroll px-2 pb-2">
                {/* Main Category */}
                <FormCombobox
                    name="main_category_code"
                    label="Main Category"
                    options={[
                        { value: null, label: t('NA') },
                        ...filteredMainCategories.map((item: any) => ({
                            value: item.code,
                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                        })),
                    ]}
                    value={selectedMainCategoryCode}
                    onChange={(val) => {
                        setSelectedMainCategoryCode(val);
                        setSelectedCategoryCode('');
                        setSelectedSubCategoryCode('');
                        applyFilter(val, '', '');
                    }}
                    className="shrink-0 hidden"
                />

                {/* Category */}
                <FormCombobox
                    name="category_code"
                    label="Category"
                    // disable={!selectedMainCategoryCode}
                    // placeholder={!selectedMainCategoryCode ? t('Please Select Main Category First.') : ''}
                    options={[
                        {
                            value: null,
                            label: !selectedMainCategoryCode ? t('Please Select Main Category.') : t('NA'),
                        },
                        ...filteredCategories.map((item: any) => ({
                            value: item.code,
                            label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                        })),
                    ]}
                    value={selectedCategoryCode}
                    onChange={(val) => {
                        setSelectedCategoryCode(val);
                        setSelectedSubCategoryCode('');
                        applyFilter(selectedMainCategoryCode, val, '');
                    }}
                    className="shrink-0"
                />

                {/* Sub Category */}
                {subCategories != null && (
                    <FormCombobox
                        name="category_code"
                        label="Sub Category"
                        disable={!selectedCategoryCode}
                        placeholder={!selectedCategoryCode ? t('Please Select Category First.') : ''}
                        options={[
                            {
                                value: null,
                                label: !selectedCategoryCode ? t('Please Select Category') : t('NA'),
                            },
                            ...filteredSubCategories.map((item: any) => ({
                                value: item.code,
                                label: `(${item.order_index}) ${currentLocale === 'kh' ? item.name_kh || item.name : item.name}`,
                            })),
                        ]}
                        value={selectedSubCategoryCode}
                        onChange={(val) => {
                            setSelectedSubCategoryCode(val);
                            applyFilter(selectedMainCategoryCode, selectedCategoryCode, val);
                        }}
                        className="shrink-0"
                    />
                )}
            </div>
        </div>
    );
};

export default FilterMainCategory;
