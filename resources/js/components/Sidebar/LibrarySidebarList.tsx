import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { ArrowRight, ChevronDownIcon, Search } from 'lucide-react';
import { useState } from 'react';
import CheckboxOption from '../Checkbox/CheckboxOption';
import { Checkbox } from '../ui/checkbox';

export default function LibrarySidebarList({
    heading = 'All Lists',
    options,
    limit = 5,
    value,
    onChange,
}: {
    heading?: string;
    options: { value: string; label: string; items_count?: number; children?: any[] }[];
    limit?: number;
    value?: string; // current selected value
    onChange?: (val: string) => void; // callback for selection
}) {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [search, setSearch] = useState('');

    // get visible slice
    let visibleOptions = options.slice(0, limit);
    // if selected is not in visible slice, push it to front
    if (value) {
        // find parent if value is a child code
        const selectedOption = options.find((o) => o.value === value || o.children?.some((child) => child.code === value));
        if (selectedOption && !visibleOptions.some((o) => o.value === selectedOption.value)) {
            visibleOptions = [...visibleOptions, selectedOption];
        }
    }

    const filteredOptions = options.filter((item) => (item.label ?? '').toLowerCase().includes((search ?? '').toLowerCase()));

    // detect if a child item is selected, then open its parent accordion
    const defaultOpenValue = (() => {
        const parent = visibleOptions.find((item) => item.children?.some((child) => child.code === value));
        return parent ? parent.value : (visibleOptions.some(o => o.value === value) ? value : undefined);
    })();

    // State to track expansion separate from the selection value
    const [expandedItem, setExpandedItem] = useState<string | undefined>(defaultOpenValue);

    const handleSelect = (val: string, isParent: boolean = false) => {
        if (onChange) {
            onChange(value === val ? '' : val);
        }
        // Only update expansion if it's a parent click or if we want to ensure the parent stays open
        if (isParent) {
            setExpandedItem(prev => prev === val ? undefined : val);
        }
    };

    const { t, currentLocale } = useTranslation();

    return (
        <div className="flex flex-col gap-2">
            <Accordion 
                type="single" 
                value={expandedItem} 
                onValueChange={setExpandedItem} 
                collapsible 
                className="w-full rounded-lg"
            >
                {visibleOptions.map((item) => (
                    <AccordionItem key={item.value} value={item.value} className="h-auto border-b-0">
                        <div className="flex">
                            <div className="flex flex-1 cursor-pointer items-center gap-3 rounded-md hover:bg-muted">
                                <div className="flex flex-1 items-center">
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(item.value, true)}
                                        className="flex flex-1 cursor-pointer items-center justify-start gap-2 rounded p-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:bg-muted"
                                    >
                                        <Checkbox
                                            id={value}
                                            checked={value ? item.value === value : false}
                                            className="size-4 rounded-full data-[state=checked]:border-primary data-[state=checked]:bg-true-primary dark:text-foreground"
                                        />
                                        <span className="flex flex-1 items-center justify-between gap-1 text-start leading-tight">
                                            <span className='line-clamp-3'>{item.label}</span>
                                            {item.items_count && <span className="font-medium text-xs">({item.items_count})</span>}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            {(item.children?.length ?? 0) > 0 && (
                                <div>
                                    <AccordionTrigger chevron={false} className="h-auto w-auto cursor-pointer py-1">
                                        <span className="rounded p-1 font-semibold hover:bg-primary/10 hover:text-primary">
                                            <ChevronDownIcon />
                                        </span>
                                    </AccordionTrigger>
                                </div>
                            )}
                        </div>

                        <AccordionContent>
                            <ul className="p- ml-4 flex flex-col gap-2 border-l pl-2.5">
                                {item.children?.map((subItem, index) => (
                                    <li key={index} className="flex items-center gap-3 rounded hover:bg-muted">
                                        <CheckboxOption
                                            key={subItem.id}
                                            value={subItem.code}
                                            label={currentLocale === 'kh' ? subItem.name_kh || subItem.name : subItem.name}
                                            checkedValue={value}
                                            onChange={(val) => handleSelect(val, false)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            {options.length > limit && (
                <button
                    type="button"
                    onClick={() => setIsOpenDialog(true)}
                    className="group mb-2 flex items-center gap-1 text-left text-sm font-semibold text-primary underline underline-offset-4 transition-all duration-300 hover:translate-x-1"
                >
                    {t("See More")}{' '}
                    <ArrowRight
                        className="translate-x-[-20px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        size={18}
                    />
                </button>
            )}

            <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
                <DialogContent className="sm:max-w-lg" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>{heading}</DialogTitle>
                    </DialogHeader>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full rounded-md border px-8 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>

                    {/* List */}
                    <div className="show-scrollbar max-h-[300px] overflow-y-auto pr-2">
                        {filteredOptions.map((item) => (
                            <div key={item.value} className="flex flex-1 items-center">
                                <button
                                    onClick={() => handleSelect(item.value, true)}
                                    className="flex flex-1 cursor-pointer items-center justify-start gap-2 rounded p-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:bg-muted"
                                >
                                    <Checkbox
                                        checked={value ? item.value === value : false}
                                        className="size-4 rounded-full data-[state=checked]:border-primary data-[state=checked]:bg-true-primary dark:text-foreground"
                                    />
                                    <span className="flex flex-1 items-center justify-between gap-1 text-start leading-tight">
                                        <span className='line-clamp-3'>{item.label}</span>
                                        {item.items_count && <span className="font-medium text-xs">({item.items_count})</span>}
                                    </span>
                                </button>
                            </div>
                        ))}
                        {filteredOptions.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No results found</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}