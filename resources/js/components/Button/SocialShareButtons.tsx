import { Facebook, Link2, Mail, Send } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

// Shadcn UI Tooltip Components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SocialShareButtonsProps {
    url?: string;
    title?: string;
    label?: string;
}

const SocialShareButtons = ({
    url = typeof window !== 'undefined' ? window.location.href : '',
    title = '',
    label = 'Share To',
}: SocialShareButtonsProps) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    // Updated IconWrapper to include Shadcn Tooltip logic
    const IconWrapper = ({
        href,
        children,
        hoverClass,
        tooltip,
    }: {
        href?: string;
        children: React.ReactNode;
        hoverClass: string;
        tooltip: string;
    }) => {
        const className = `flex h-10 w-10 items-center justify-center rounded-xl bg-muted/40 text-muted-foreground transition-all duration-200 ${hoverClass}`;

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                            {children}
                        </a>
                    ) : (
                        <button onClick={copyToClipboard} className={className}>
                            {children}
                        </button>
                    )}
                </TooltipTrigger>
                <TooltipContent side="bottom" className="font-medium">
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-primary">{label}</span>
                    <div className="h-0.5 w-4 rounded-full bg-primary/30" />
                </div>

                <div className="flex items-center gap-2">
                    <IconWrapper href={shareLinks.facebook} tooltip="Facebook" hoverClass="hover:bg-blue-500/10 hover:text-[#1877F2]">
                        <Facebook size={18} strokeWidth={2} />
                    </IconWrapper>

                    <IconWrapper href={shareLinks.telegram} tooltip="Telegram" hoverClass="hover:bg-sky-500/10 hover:text-[#26A5E4]">
                        <Send size={18} strokeWidth={2} />
                    </IconWrapper>

                    <IconWrapper href={shareLinks.email} tooltip="Email" hoverClass="hover:bg-red-500/10 hover:text-red-500">
                        <Mail size={18} strokeWidth={2} />
                    </IconWrapper>

                    <IconWrapper tooltip="Copy Link" hoverClass="hover:bg-primary/10 hover:text-primary">
                        <Link2 size={18} strokeWidth={2} />
                    </IconWrapper>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default SocialShareButtons;
