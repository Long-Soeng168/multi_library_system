import { TooltipButton } from '@/components/Button/TooltipButton';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { SlidersHorizontalIcon } from 'lucide-react';
import { useState } from 'react';

interface FilterSheetProps {
    children: React.ReactNode;
    handleFilter?: () => void;
    resetFilter?: () => void;
    isFiltered?: boolean;
}
const FilterSheet = ({ children, handleFilter, resetFilter, isFiltered }: FilterSheetProps) => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const { t } = useTranslation();
    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen} modal={false}>
                <TooltipButton tooltip="Filter">
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                                'relative size-11 rounded shadow-none hover:bg-primary hover:text-white',
                                isFiltered && 'border-primary text-primary dark:border-primary',
                            )}
                        >
                            <SlidersHorizontalIcon />{' '}
                            {isFiltered && (
                                <div className="absolute -top-1 -right-1">
                                    {/* Animate */}
                                    <span className="relative flex size-3">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-50"></span>
                                        <span className="relative inline-flex size-3 rounded-full bg-red-500"></span>
                                    </span>
                                </div>
                            )}
                        </Button>
                    </SheetTrigger>
                </TooltipButton>
                {sheetOpen && <div className="fixed inset-0 z-40 bg-black/55" />}
                <SheetContent side="left" className="z-50 w-[85vw] gap-0">
                    <SheetHeader className="gap-0">
                        <SheetTitle>{t('Filter')}</SheetTitle>
                        <SheetDescription></SheetDescription>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto px-4">{children}</div>
                    <SheetFooter>
                        <Button
                            type="button"
                            onClick={() => {
                                handleFilter && handleFilter();
                                setSheetOpen(false);
                            }}
                        >
                            {t('Apply Filter')}
                        </Button>
                        <Button type="button" variant="outline" onClick={resetFilter}>
                            {t('Clear Filter')}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default FilterSheet;
