import RefreshButton from '@/components/Button/RefreshButton';
import { TooltipButton } from '@/components/Button/TooltipButton';
import LoadingOnPrefetch from '@/components/Loading/LoadingOnPrefetch';
import ResourceSearch from '@/components/Search/ResourceSearch';
import ResourceListHorizontal from '@/components/Section/ResourceListHorizontal';
import ResourceSortBySelect from '@/components/Select/ResourceSortBySelect';
import ResourceSidebar from '@/components/Sidebar/ResourceSidebar';
import ResourceSidebarSheet from '@/components/Sidebar/ResourceSidebarSheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { usePage } from '@inertiajs/react';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

const LibrariesPage = () => {
    const [isShowSidebar, setIsShowSidebar] = useState(true);

    const { mainCategory } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <FrontPageLayout>
            <section className="section-container mb-10">
                <div className="my-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/resources">{t('Resources')}</BreadcrumbLink>
                            </BreadcrumbItem> 
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex">
                    <div className={`hidden transition-all duration-300 ease-in-out md:block ${isShowSidebar ? 'mr-6 w-64' : 'w-0 overflow-hidden'}`}>
                        <ResourceSidebar />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            {/* Left Action Header */}
                            <div className="flex flex-1 items-center gap-2">
                                {/* Show Or Hide Sidebar Button Trigger */}
                                <TooltipButton tooltip={isShowSidebar ? 'Hide Filter' : 'Show Filter'}>
                                    <Button
                                        onClick={() => setIsShowSidebar(!isShowSidebar)}
                                        variant="ghost"
                                        size="icon"
                                        className="hidden size-11 rounded-md bg-muted text-primary hover:bg-primary hover:text-white md:flex"
                                    >
                                        <SlidersHorizontalIcon className="h-5 w-5" />
                                    </Button>
                                </TooltipButton>
                                {/* Show Or Hide Sidebar Sheet Button Trigger */}
                                <ResourceSidebarSheet className="md:hidden" />

                                {/* Search Input */}
                                <div className="max-w-full flex-1">
                                    <ResourceSearch />
                                </div>
                            </div>

                            {/* Rigth Action Header */}
                            <div className="flex w-full justify-end gap-2 lg:w-auto">
                                <RefreshButton />
                                <ResourceSortBySelect />
                            </div>
                        </div>
                        <div className="h-6">
                            <LoadingOnPrefetch />
                        </div>
                        <ResourceListHorizontal />
                    </div>
                </div>
            </section>
        </FrontPageLayout>
    );
};

export default LibrariesPage;
