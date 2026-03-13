import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { SlidersHorizontalIcon } from 'lucide-react';
import { TooltipButton } from '../Button/TooltipButton';
import { Button } from '../ui/button';
import ResourceSidebar from './ResourceSidebar';
const ResourceSidebarSheet = ({ className }: { className?: string }) => {
    return (
        <>
            <Sheet>
                <TooltipButton tooltip={'Show Filter'}>
                    <SheetTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn('size-11 rounded-md bg-muted text-primary hover:bg-primary hover:text-white', className)}
                        >
                            <SlidersHorizontalIcon className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                </TooltipButton>

                <SheetContent side="left" className="gap-0">
                    <SheetHeader>
                        <SheetTitle>Filter</SheetTitle>
                    </SheetHeader>
                    <div className="overflow-y-scroll p-2">
                        <ResourceSidebar />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default ResourceSidebarSheet;
