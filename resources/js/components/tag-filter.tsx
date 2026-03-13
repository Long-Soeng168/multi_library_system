import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerTrigger } from '@/components/ui/drawer';
import useTranslation from '@/hooks/use-translation';
import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TagFilterProps {
    tags: {
        code: string;
        name: string;
        name_kh: string;
        posts_count?: number;
    }[];
}

export function TagFilter({ tags }: TagFilterProps) {
    const searchParams = new URLSearchParams(window.location.search);
    const initialTag = searchParams.get('category_code') || '';
    const { t, currentLocale } = useTranslation();

    const [selectedTag, setSelectedTag] = useState<string | null>(initialTag);

    useEffect(() => {
        setSelectedTag(initialTag);
    }, [initialTag]);

    const applyTag = (tag: string | null) => {
        const params = new URLSearchParams(window.location.search);

        if (tag) {
            params.set('category_code', tag);
        } else {
            params.delete('category_code');
        }

        params.set('page', '1');

        router.get(
            `/posts?${params.toString()}`,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleTagClick = (tag: string) => {
        const next = selectedTag === tag ? '' : tag;
        setSelectedTag(next);
        applyTag(next);
    };

    const DesktopTagFilter = () => (
        <div className="hidden flex-wrap gap-2 md:flex">
            {tags.map((item) => {
                const active = selectedTag === item.code;

                return (
                    <button
                        key={item.code}
                        onClick={() => handleTagClick(item.code)}
                        className={`flex h-8 items-center gap-2 border px-3 text-sm transition-colors ${
                            active ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
                        }`}
                    >
                        <span>{currentLocale == 'kh' ? (item.name_kh ?? item.name) : item.name}</span>

                        {item.posts_count !== undefined && (
                            <span
                                className={`flex items-center justify-center text-xs font-semibold text-primary ${
                                    active ? 'text-primary-foreground' : ''
                                }`}
                            >
                                ({item.posts_count})
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );

    const MobileTagFilter = () => (
        <Drawer>
            <DrawerTrigger className="flex w-full items-center justify-between rounded-none border px-4 py-2 md:hidden">
                <span className="text-sm font-medium">{selectedTag ? tags.find((t) => t.code === selectedTag)?.name : t('All Category')}</span>
                <ChevronDown className="h-4 w-4" />
            </DrawerTrigger>

            <DrawerContent className="md:hidden">
                <DrawerHeader>
                    <h3 className="text-sm font-semibold">{t('Select Category')}</h3>
                </DrawerHeader>

                <DrawerBody>
                    <div className="space-y-3">
                        {tags.map((item) => {
                            const active = selectedTag === item.code;

                            return (
                                <button
                                    key={item.code}
                                    onClick={() => handleTagClick(item.code)}
                                    className="flex w-full items-center justify-between text-sm"
                                >
                                    <span className={active ? 'text-primary underline underline-offset-4' : 'text-muted-foreground'}>
                                        {currentLocale == 'kh' ? (item.name_kh ?? item.name) : item.name}
                                    </span>

                                    {item.posts_count !== undefined && (
                                        <span className="flex items-center justify-center text-xs font-semibold text-primary">
                                            ({item.posts_count})
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );

    return (
        <>
            <DesktopTagFilter />
            <MobileTagFilter />
        </>
    );
}
