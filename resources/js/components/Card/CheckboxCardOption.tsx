import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CircleCheck } from 'lucide-react';

interface CheckboxCardOption {
    value: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CheckboxCardProps {
    option: CheckboxCardOption;
    checked: boolean;
    className?: string;
    checkBoxClassName?: string;
    labelClassName?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function CheckboxCardOption({
    option,
    checked,
    className,
    checkBoxClassName,
    labelClassName,
    onChange,
    disabled = false,
}: CheckboxCardProps) {
    const { t } = useTranslation();
    return (
        <CheckboxPrimitive.Root
            disabled={disabled}
            checked={checked}
            onCheckedChange={() => onChange(option.value)}
            className={cn(
                'relative w-full cursor-pointer rounded-lg border-[1px] border-border p-3 pb-2 text-start text-muted-foreground transition-all duration-300 hover:border-primary hover:ring-4 hover:ring-primary/20',
                'space-y-2 data-[state=checked]:border-1 data-[state=checked]:border-primary data-[state=checked]:text-primary',
                className,
            )}
        >
            <option.icon className="h-5 w-5" />
            <span className={cn('text-[14px] font-medium tracking-tight sm:text-base', labelClassName)}>{option.label}</span>
            <CheckboxPrimitive.Indicator className={cn('absolute top-1 right-1', checkBoxClassName)}>
                <CircleCheck className="size-5 fill-primary text-primary-foreground" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}
