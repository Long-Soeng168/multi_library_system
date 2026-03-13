import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { FormLabel } from './FormLabel';

interface FormFieldMultiSelectProps {
    label: string;
    options: Option[];
    value: { value: string; label: string }[]; // selected author IDs
    onChange: (objectValue: { value: string; label: string }[]) => void;
    error?: string;
    multiSelectClassName?: string;
}

const FormFieldMultiSelect = ({ label, options, value, onChange, error, multiSelectClassName }: FormFieldMultiSelectProps) => {
    const { t } = useTranslation();
    return (
        <div className="grid w-full content-start gap-2">
            <FormLabel label={label} />
            <MultipleSelector
                defaultOptions={options}
                badgeClassName="bg-border text-border-forground text-sm rounded"
                value={value} // pass current selected values
                onChange={onChange} // callback when selection changes
                placeholder={t(`Select ${label}...`)}
                className={cn('rounded dark:border-white/20', multiSelectClassName)}
                emptyIndicator={<p className="text-center text-sm text-gray-500 dark:text-gray-400">{t('No results found.')}</p>}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormFieldMultiSelect;
