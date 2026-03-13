import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsRight } from 'lucide-react';
const ParentBreadcrumb = ({ path = '/admin/pages' }) => {
    const { selectedPage, selectedPageParents } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    if (!selectedPage) {
        return null;
    }

    return (
        <div className="mb-4 px-2">
            <Breadcrumb>
                <BreadcrumbList>
                    <Link href={`${path}`}>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <Badge variant="secondary" className="rounded-full font-light shadow-none ring-primary hover:ring">
                                    {t('All Pages')}
                                </Badge>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </Link>

                    <BreadcrumbSeparator>
                        <ChevronsRight />
                    </BreadcrumbSeparator>
                    {selectedPageParents?.map((item: any) => (
                        <>
                            <Link href={`${path}?selected_page_id=${item.id}`}>
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        <Badge variant="secondary" className="rounded-full font-medium shadow-none ring-primary hover:ring">
                                            {currentLocale === 'kh' ? item.name_kh || item.name : item.name}
                                        </Badge>
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </Link>

                            <BreadcrumbSeparator>
                                <ChevronsRight />
                            </BreadcrumbSeparator>
                        </>
                    ))}

                    <Link href={`${path}?selected_page_id=${selectedPage.id}`}>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border border-primary text-primary shadow-none ring-primary/20 hover:ring-3"
                                >
                                    {currentLocale === 'kh' ? selectedPage.name_kh || selectedPage.name : selectedPage.name}
                                </Badge>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </Link>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
export default ParentBreadcrumb;
