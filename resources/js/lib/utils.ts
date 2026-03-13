import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toCapitalize(text: string) {
    if (!text) return '';
    return text
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function stripHtml(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function toSlug(input: string): string {
    if (!input) return '';

    return input
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[~!@#$%^&*()_+]/g, '')
        .replace(/-+/g, '-')
        .toLowerCase();
}

export const formatToKhmerDateTime = (utcDate?: string, showTime = true, showFulllYear = false) => {
    if (!utcDate) return '-';

    const date = new Date(utcDate);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: 'short',
        year: showFulllYear ? 'numeric' : '2-digit',
    };

    if (showTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.second = '2-digit';
        options.hour12 = true;
    }

    return date.toLocaleString('en-GB', options);
};
