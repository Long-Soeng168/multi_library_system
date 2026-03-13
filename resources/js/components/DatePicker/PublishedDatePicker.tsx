import { Check, ChevronsUpDown, RotateCwIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { FormLabel } from '../Input/FormLabel';

const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

// Generate days 1–31
const days = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
}));

// Generate years (last 100 years)
const currentYear = new Date().getFullYear() + 2;
const years = Array.from({ length: 200 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
}));

interface SelectPickerProps {
    options: { value: string; label: string }[];
    value: string | number | null;
    onChange: (val: string) => void;
    placeholder: string;
    disabled?: boolean;
}

function SelectPicker({ options, value, onChange, placeholder, disabled = false }: SelectPickerProps) {
    const [open, setOpen] = React.useState(false);
    const { t, currentLocale } = useTranslation();
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant="outline" role="combobox" aria-expanded={open} className="w-full flex-1 justify-between rounded">
                    {value ? options.find((opt) => opt.value === String(value))?.label : placeholder}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[168px] p-0">
                <Command>
                    <CommandInput placeholder={`${t('Search')} ${placeholder.toLowerCase()}...`} className="h-9" />
                    <CommandList>
                        <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
                        <CommandGroup>
                            {[
                                {
                                    value: '',
                                    label: 'NA',
                                },
                                ...options,
                            ].map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(val) => {
                                        onChange(val == value ? '' : val);
                                        setOpen(false);
                                    }}
                                >
                                    {t(opt.label)}
                                    <Check className={cn('ml-auto', value === opt.value ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

interface PublishedDatePickerProps {
    published_year?: string;
    setPublished_year: (val: string) => void;
    published_month?: string;
    setPublished_month: (val: string) => void;
    published_day?: string;
    setPublished_day: (val: string) => void;
}

export default function PublishedDatePicker({
    published_year,
    setPublished_year,
    published_month,
    setPublished_month,
    published_day,
    setPublished_day,
}: PublishedDatePickerProps) {
    const { t } = useTranslation();

    return (
        <div className="grid content-start gap-2">
            <FormLabel label="Published At" />
            <div className="flex gap-2">
                <SelectPicker options={years} value={published_year || ''} onChange={setPublished_year} placeholder={t('Year')} />
                <SelectPicker
                    options={months}
                    disabled={!published_year}
                    value={published_month || ''}
                    onChange={setPublished_month}
                    placeholder={t('Month')}
                />
                <SelectPicker
                    options={days}
                    value={published_day || ''}
                    disabled={!published_month}
                    onChange={setPublished_day}
                    placeholder={t('Day')}
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground transition hover:border-gray-400"
                    onClick={() => {
                        setPublished_year('');
                        setPublished_month('');
                        setPublished_day('');
                    }}
                >
                    <RotateCwIcon className="size-4" />
                    {t('Clear Date')}
                </button>
            </div>
        </div>
    );
}
