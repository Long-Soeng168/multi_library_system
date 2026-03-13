import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const ResourceBreadcrumb = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#" className="text-foreground">
                        Resources
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator />
               <BreadcrumbItem>
                    <BreadcrumbLink href="#" className='font-semibold'>Theses</BreadcrumbLink>
                </BreadcrumbItem> */}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default ResourceBreadcrumb;
