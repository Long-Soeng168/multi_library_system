import '@/../css/ckeditorContentStyle.css';
import { cn } from '@/lib/utils';

type HtmlContentDisplayProps = {
    content: string;
    className?: string;
    isRemoveImage?: boolean;
    isRemoveAllStyles?: boolean;
    isRemoveAllAttributes?: boolean;
    isRemoveAllClass?: boolean;
    isRemoveAllEmptyTags?: boolean;
};

const HtmlContentDisplay = ({
    content,
    className,
    isRemoveImage = false,
    isRemoveAllStyles = false,
    isRemoveAllAttributes = false,
    isRemoveAllClass = false,
    isRemoveAllEmptyTags = false,
}: HtmlContentDisplayProps) => {
    let processedContent = content;

    // 1️⃣ Remove <img> tags
    if (isRemoveImage) {
        processedContent = processedContent.replace(/<img[^>]*>/gi, '');
    }

    // 2️⃣ Remove inline style attributes
    if (isRemoveAllStyles) {
        processedContent = processedContent.replace(/\s*style="[^"]*"/gi, '');
    }

    // 3️⃣ Remove class attributes
    if (isRemoveAllClass) {
        processedContent = processedContent.replace(/\s*class="[^"]*"/gi, '');
    }

    // 4️⃣ Remove all other attributes (keep tag name only)
    if (isRemoveAllAttributes) {
        processedContent = processedContent.replace(/<(\w+)[^>]*>/gi, '<$1>');
    }

    // 5️⃣ Remove empty tags (including whitespace or &nbsp;)
    if (isRemoveAllEmptyTags) {
        processedContent = processedContent.replace(/<(\w+)[^>]*>(\s|&nbsp;)*<\/\1>/gi, '');
    }

    return (
        <div
            className={cn('ck-content prose max-w-none font-sans dark:prose-invert', className)}
            dangerouslySetInnerHTML={{ __html: processedContent }}
        />
    );
};

export default HtmlContentDisplay;
