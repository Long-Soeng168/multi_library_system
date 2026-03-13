import { Checkbox } from '@/components/ui/checkbox';

interface CheckboxOptionProps {
    value: string;
    label: string;
    checkedValue?: string | undefined;
    onChange: (value: string) => void;
}

export default function CheckboxOption({ value, label, checkedValue, onChange }: CheckboxOptionProps) {
    return (
        <div className="flex flex-1 items-center">
            <button
                onClick={() => onChange(value)}
                className="flex flex-1 cursor-pointer items-center justify-start gap-2 rounded p-2 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:bg-muted"
            >
                <Checkbox
                    id={value}
                    checked={checkedValue ? checkedValue == value : false}
                    className="size-4 rounded-full data-[state=checked]:border-primary data-[state=checked]:bg-true-primary dark:text-foreground"
                />
                <span className="flex-1 text-start leading-tight">{label}</span>
            </button>
        </div>
    );
}
