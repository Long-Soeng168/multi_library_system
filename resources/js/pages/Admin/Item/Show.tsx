import ResourceDetail from '@/components/Section/ResourceDetail';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRightIcon, EditIcon } from 'lucide-react';
import { useState } from 'react';
import ItemPhysicalCopy from './ItemPhysicalCopy';

const Show = () => {
    const { showData, view_physical_copies, user_library, auth } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();
    const hasPermission = usePermission();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Items', href: hasPermission('item view') ? '/admin/items' : `/dashboard/library/${user_library?.code}/items` },
        { title: showData?.name, href: '#' },
    ];

    const [inputLanguage, setInputLanguage] = useState<'itemDetail' | 'physicalCopies'>(view_physical_copies ? 'physicalCopies' : 'itemDetail');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <section className="p-3">
                <Tabs value={inputLanguage} onValueChange={(val: any) => setInputLanguage(val)}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <TabsList className="mb-1 border bg-border/50 p-1 dark:border-white/20">
                            <TabsTrigger value="itemDetail" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Item Detail')}
                            </TabsTrigger>
                            <TabsTrigger value="physicalCopies" className="h-full dark:data-[state=active]:bg-white/20">
                                {t('Physical Copies')}
                            </TabsTrigger>
                        </TabsList>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <Link
                                href={
                                    hasPermission('item view')
                                        ? `/admin/items/${showData.id}/edit`
                                        : `/dashboard/library/${user_library?.code}/items/${showData.id}/edit`
                                }
                            >
                                <Button variant="outline">
                                    <EditIcon />
                                    {t('Edit Detail')}
                                </Button>
                            </Link>
                            <a target="_blank" href={`/resources/detail/${showData.id}`}>
                                <Button variant="outline">
                                    {t('Public View')} <ArrowRightIcon />
                                </Button>
                            </a>
                        </div>
                    </div>
                    <TabsContent value="itemDetail">
                        <ResourceDetail imageContainerClassname="sm:max-w-[300px] sm:min-w-[300px]" showButtonBelowImages={false} />
                        <section className="mt-8">
                            <ItemPhysicalCopy />
                        </section>
                    </TabsContent>
                    <TabsContent value="physicalCopies">
                        <section>
                            <ItemPhysicalCopy />
                        </section>
                    </TabsContent>
                </Tabs>
            </section>
        </AppLayout>
    );
};

export default Show;
