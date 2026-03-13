import { RefreshCcwIcon } from 'lucide-react';

interface GenerateRandomEmailButtonProps {
    setData: (field: 'email', value: string) => void;
}

const GenerateRandomEmailButton = ({ setData }: GenerateRandomEmailButtonProps) => {
    const handleClick = () => {
        const randomString = Math.random().toString(36).substring(2, 8);
        setData('email', `user-${randomString}@email.com`);
    };

    return (
        <button
            type="button"
            className="mt-1 inline-flex items-center cursor-pointer gap-1 rounded border bg-muted px-2 py-1 text-xs font-medium text-muted-foreground transition hover:border-gray-400"
            onClick={handleClick}
        >
            <RefreshCcwIcon className="h-3 w-3" />
            Random
        </button>
    );
};

export default GenerateRandomEmailButton;
