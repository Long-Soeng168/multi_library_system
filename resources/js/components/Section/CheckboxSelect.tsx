import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type Option = {
    label: string;
    value: string;
};

interface CheckboxSelectProps {
    options: Option[];
    value: string[];
    onChange: (vals: string[]) => void;
    name: string;
}

export default function CheckboxSelect({ options, value, onChange, name }: CheckboxSelectProps) {
    const handleToggle = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((v) => v !== val));
        } else {
            onChange([...value, val]);
        }
    };

    return (
        <div className="space-y-2">
            {options.map((item) => {
                const id = `${name}-${item.value}`;

                return (
                    <div key={item.value} className="flex items-center space-x-2">
                        <Checkbox id={id} checked={value.includes(item.value)} onCheckedChange={() => handleToggle(item.value)} />
                        <Label htmlFor={id}>{item.label}</Label>
                    </div>
                );
            })}
        </div>
    );
}
