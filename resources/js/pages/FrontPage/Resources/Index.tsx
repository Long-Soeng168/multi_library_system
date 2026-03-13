import LibrarySearch from '@/components/Search/LibrarySearch';
import ResourceMainCategory from '@/components/Section/ResourceMainCategory';
import ResourcesListSection from '@/components/Section/ResourcesListSection';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';

const Index = () => {
    const { t } = useTranslation();
    return (
        <FrontPageLayout>
            <section className="mb-20">
                <div className="section-container my-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink className="text-foreground" href="/resources">
                                    {t('Resources')}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="section-container">
                    <LibrarySearch />
                </div>
                <div>
                    <ResourceMainCategory />
                </div>

                <ResourcesListSection containerClassName="mt-8" />
            </section>
        </FrontPageLayout>
    );
};

export default Index;
