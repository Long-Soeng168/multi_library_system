import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import useTranslation from '@/hooks/use-translation';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsRight } from 'lucide-react';
const CategoryBreadcrumb = ({ path = '/admin/post-categories' }) => {
    const { filteredCategory, allParents } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    if (!filteredCategory) {
        return null;
    }

    return (
        <div className="mt-2 mb-4 px-2">
            <Breadcrumb>
                <BreadcrumbList>
                    <Link href={`${path}`}>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <Badge variant="secondary" className="rounded-full font-light shadow-none ring-primary hover:ring">
                                    {t('All Categories')}
                                </Badge>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </Link>

                    <BreadcrumbSeparator>
                        <ChevronsRight />
                    </BreadcrumbSeparator>
                    {allParents?.map((item: any) => (
                        <>
                            <Link href={`${path}?category_code=${item.code}&main_category_code=${filteredCategory?.item_main_category_code}`}>
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

                    <Link href={`${path}?category_code=${filteredCategory.code}&main_category_code=${filteredCategory?.item_main_category_code}`}>
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                <Badge
                                    variant="secondary"
                                    className="rounded-full border border-primary text-primary shadow-none ring-primary/20 hover:ring-3"
                                >
                                    {currentLocale === 'kh' ? filteredCategory.name_kh || filteredCategory.name : filteredCategory.name}
                                </Badge>
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </Link>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
export default CategoryBreadcrumb;
