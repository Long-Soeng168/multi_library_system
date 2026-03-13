import { TooltipButton } from '@/components/Button/TooltipButton';
import { Button } from '@/components/ui/button';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CopyFileUrl = ({ url }: { url: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Copy successfully!', {
                description: 'URL : ' + url,
            });
            setCopied(true);

            // Reset icon after 2 seconds
            setTimeout(() => setCopied(false), 4000);
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    return (
        <div>
            <TooltipButton tooltip={copied ? 'Copied!' : 'Copy File URL'}>
                <Button size="icon" variant='outline' className="h-8 w-8 dark:bg-accent p-0" onClick={handleCopy}>
                    {copied ? <CopyCheckIcon className="text-green-700" /> : <CopyIcon />}
                </Button>
            </TooltipButton>
        </div>
    );
};

export default CopyFileUrl;
