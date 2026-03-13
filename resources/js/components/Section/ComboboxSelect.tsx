import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Input } from '../ui/input';

interface ComboboxSelectProps {
    options: { value: string; label: string }[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    disable?: boolean;
}

export function ComboboxSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    className,
    disable = false,
}: ComboboxSelectProps) {
    const [open, setOpen] = React.useState(false);

    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    const { t } = useTranslation();

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disable}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('flex w-full max-w-full justify-between overflow-hidden rounded dark:border-white/20', className)}
                >
                    <span className="flex-1 overflow-hidden text-start text-ellipsis">{selectedLabel ? t(selectedLabel) : t(placeholder)}</span>
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-[250px] max-w-[350px] dark:border-foreground/50 border p-0">
                <Command>
                    <CommandInput placeholder={t(searchPlaceholder)} className="h-9" />
                    <CommandList>
                        <CommandEmpty>{t('No results found.')}</CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    className="font-mono"
                                    key={opt.value}
                                    value={opt.value + opt.label}
                                    onSelect={() => {
                                        onChange(opt.value);
                                        setOpen(false);
                                    }}
                                >
                                    {opt.label}
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
