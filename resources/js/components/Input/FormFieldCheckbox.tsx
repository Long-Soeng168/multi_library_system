import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { FormDescription } from './FormDescription';
import { FormErrorLabel } from './FormErrorLabel';
import { FormLabel } from './FormLabel';

interface FormFieldCheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    containerClassName?: string;
}

export function FormFieldCheckbox({
    id,
    label,
    checked,
    onChange,
    description,
    error,
    required,
    disabled = false,
    containerClassName,
}: FormFieldCheckboxProps) {
    const { t } = useTranslation();

    return (
        <div className={cn('grid content-start gap-2', containerClassName)}>
            <FormLabel id={id} label={label} required={required} />

            <div
                className={cn(
                    'flex items-center space-x-3 rounded border bg-muted/20 px-3 py-2 transition-colors dark:border-white/20',
                    error ? 'border-destructive' : '',
                    disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                )}
                onClick={() => !disabled && onChange(!checked)}
            >
                <input
                    id={id}
                    type="checkbox"
                    disabled={disabled}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary dark:border-white/20 dark:bg-transparent"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    onClick={(e) => e.stopPropagation()} // Prevents double-toggle from div click
                />
                <span className="text-sm font-medium text-foreground/70 select-none">{checked ? t('Enabled') : t('Disabled')}</span>
            </div>

            {description && <FormDescription description={description} />}
            <FormErrorLabel error={error} />
        </div>
    );
}
