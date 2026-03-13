import { cn } from '@/lib/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { CircleCheck } from 'lucide-react';
import { FormLabel } from './FormLabel';

interface Option {
    value: string;
    label: string;
    description?: string;
}

interface FormRadioStatusProps {
    name: string;
    label?: string;
    required?: boolean;
    options: Option[];
    value?: string;
    onChange?: (val: string) => void;
    error?: string;
    radioGroupClassName?: string;
}

const FormRadioStatus = ({ name, label, required, options, value, onChange, error, radioGroupClassName }: FormRadioStatusProps) => {
    return (
        <div className="grid content-start gap-2">
            {label && <FormLabel label={label} required={required} />}

            <RadioGroupPrimitive.Root
                name={name}
                value={value}
                onValueChange={onChange}
                className={cn('grid w-full max-w-md grid-cols-3 gap-4', radioGroupClassName)}
            >
                {options.map((option) => (
                    <RadioGroupPrimitive.Item
                        key={option.value}
                        value={option.value}
                        className={cn(
                            'group relative rounded px-3 py-2 text-start ring-[1px] ring-border transition-all',
                            'data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                        )}
                    >
                        <CircleCheck className="absolute top-0 right-0 h-6 w-6 translate-x-1/2 -translate-y-1/2 fill-primary stroke-primary-foreground text-primary group-data-[state=unchecked]:hidden" />
                        <span className="tracking-tight text-foreground">{option.label}</span>
                        {option.description && <p className="pt-1 text-xs text-muted-foreground">{option.description}</p>}
                    </RadioGroupPrimitive.Item>
                ))}
            </RadioGroupPrimitive.Root>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormRadioStatus;
