import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const LibraryBreadcrumb = () => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="#" className='font-semibold'>Libraries</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
               <BreadcrumbItem>
                    <BreadcrumbLink href="#" className='font-semibold'>My Library Name</BreadcrumbLink>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default LibraryBreadcrumb;
