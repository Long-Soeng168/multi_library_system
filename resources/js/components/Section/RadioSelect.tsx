import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useTranslation from '@/hooks/use-translation';

type Option = {
    label: string;
    value: string;
};

interface RadioSelectProps {
    options: Option[];
    value: string;
    onChange: (val: string) => void;
    name: string;
}

export default function RadioSelect({ options, value, onChange, name }: RadioSelectProps) {
    const { t } = useTranslation();
    return (
        <RadioGroup value={value} onValueChange={onChange}>
            {options.map((item) => {
                const id = `${name}-${item.value}`;
                return (
                    <div key={item.value} className="flex items-center">
                        <RadioGroupItem value={item.value} id={id} />
                        <Label className="px-2 py-1" htmlFor={id}>
                            {t(item.label)}
                        </Label>
                    </div>
                );
            })}
        </RadioGroup>
    );
}
