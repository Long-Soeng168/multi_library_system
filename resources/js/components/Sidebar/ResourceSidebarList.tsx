import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/animate-ui/radix/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowDownIcon, ChevronDownIcon, Search } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export default function ResourceSidebarList({
    heading = 'All Lists',
    options,
    limit = 5,
}: {
    heading?: string;
    options: { value: string; label: string }[];
    limit?: number;
}) {
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [search, setSearch] = useState('');
    const visibleOptions = options.slice(0, limit);

    const filteredOptions = options.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col">
            <Accordion type="single" collapsible className="w-full rounded-lg">
                {visibleOptions.map((item) => (
                    <AccordionItem value={item.value} className="h-auto border-b-0">
                        <div className="flex mt-1">
                            <div className="flex w-full flex-1 cursor-pointer items-center gap-3 rounded-md px-2 hover:bg-muted">
                                <Checkbox id={item.value} />
                                <Label htmlFor={item.value} className="cursor-pointer leading-snug">
                                    {item.label}
                                </Label>
                            </div>
                            <div>
                                <AccordionTrigger chevron={false} className="size-8 w-auto cursor-pointer py-1">
                                    <span className="rounded p-1 font-semibold hover:bg-primary/10 hover:text-primary">
                                        <ChevronDownIcon />
                                    </span>
                                </AccordionTrigger>
                            </div>
                        </div>

                        <AccordionContent>
                            <ul className="p- ml-4 flex flex-col gap-2 border-l pl-2.5">
                                {[
                                    'ធនាគារ និងហិរញ្ញវត្ថុ',
                                    'សេដ្ឋកិច្ចអភិវឌ្ឍន៍',
                                    'គ្រប់គ្រងពាណិជ្ជកម្ម',
                                    'គណនេយ្យ',
                                    'ទេសចរណ៍',
                                    'ច្បាប់',
                                    'ធនានុសិស្ស និងគ្រប់គ្រង',
                                ].map((text, index) => (
                                    <li key={index} className="flex items-center gap-3 rounded px-2 py-1 hover:bg-muted">
                                        <Checkbox id={`content-${index}`} />
                                        <Label htmlFor={`content-${index}`} className="cursor-pointer leading-snug">
                                            {text}
                                        </Label>
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
                    className="group flex items-center gap-1 p-2 text-left text-sm font-semibold text-primary underline underline-offset-4 transition-all duration-300 hover:translate-x-1"
                >
                    See More
                    <ArrowDownIcon
                        className="translate-y-[-20px] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
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
                            autoFocus={false}
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
                            <div key={item.value} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted/40">
                                <Checkbox id={item.value} />
                                <Label htmlFor={item.value} className="text-sm">
                                    {item.label}
                                </Label>
                            </div>
                        ))}
                        {filteredOptions.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No results found</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
