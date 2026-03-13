import useTranslation from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { BookOpenIcon, FileDownIcon, ImageIcon, Maximize2Icon, Minimize2Icon, RotateCwSquareIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';

export default function BookImagesGallery({ images = [''], mainImageClassName = '', alternative = '', aspectRatio = '7/10', readUrl = '#' }) {
    const [mainImage, setMainImage] = useState(images[0]);
    const { t, currentLocale } = useTranslation();

    const [visible, setVisible] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = () => {
        const doc = document;
        const el = doc.documentElement;

        if (!doc.fullscreenElement) {
            el.requestFullscreen().then(() => setIsFullScreen(true));
        } else {
            doc.exitFullscreen().then(() => setIsFullScreen(false));
        }
    };

    const handleVisibleChange = (visible: boolean) => {
        // when PhotoView closes, exit fullscreen if still active
        if (!visible && document.fullscreenElement) {
            document.exitFullscreen().then(() => setIsFullScreen(false));
        }
    };

    return (
        <PhotoProvider
            onVisibleChange={handleVisibleChange}
            maskOpacity={0.9}
            toolbarRender={({ scale, onScale, rotate, onRotate }) => (
                <div className="flex h-[44px] items-center gap-2 bg-black/50 px-2">
                    <button onClick={() => onScale(scale + 0.25)} className="bg-white/15 p-2 hover:bg-white/20">
                        <ZoomInIcon size={16} />
                    </button>
                    <button onClick={() => onScale(scale - 0.25)} className="bg-white/15 p-2 hover:bg-white/20">
                        <ZoomOutIcon size={16} />
                    </button>
                    <button onClick={() => onRotate(rotate + 90)} className="bg-white/15 p-2 hover:bg-white/20">
                        <RotateCwSquareIcon size={16} />
                    </button>
                    <button onClick={toggleFullScreen} className="bg-white/15 p-2 hover:bg-white/20">
                        {isFullScreen ? <Minimize2Icon size={16} /> : <Maximize2Icon size={16} />}
                    </button>
                </div>
            )}
            overlayRender={() => (
                <div className={cn('absolute right-0 bottom-0 left-0 z-10 flex bg-transparent', !readUrl && 'hidden')}>
                    <div className="z-20 mx-auto flex w-full items-center justify-center text-sm text-white lg:justify-end">
                        <div className="flex w-full justify-center gap-2 bg-black/50 p-2">
                            <Link href={`${readUrl}`}>
                                <button className="flex h-[44px] w-40 cursor-pointer flex-row items-center justify-center gap-1 bg-white/10 py-2 transition hover:bg-white/20 active:scale-95">
                                    <BookOpenIcon size={20} />
                                    <span>{t('Read File')}</span>
                                </button>
                            </Link>
                            <a href={`${readUrl}&is_download=1`}>
                                <button className="flex h-[44px] w-40 cursor-pointer flex-row items-center justify-center gap-1 bg-white/10 py-2 transition hover:bg-white/20 active:scale-95">
                                    <FileDownIcon size={20} />
                                    <span>{t('Download')}</span>
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        >
            <div className="flex w-full flex-col items-center">
                {/* Main image */}
                {images.map((src, idx) => (
                    <PhotoView key={idx} src={src}>
                        <Avatar>
                            <AvatarImage
                                src={src}
                                className={cn(
                                    `h-full max-h-[800px] w-full cursor-pointer rounded-none border border-primary object-cover sm:max-w-sm ${src === mainImage ? '' : 'hidden'} aspect-[${aspectRatio}]`,
                                    mainImageClassName,
                                    `${images?.length == 1 && 'aspect-auto'}`,
                                )}
                                alt={alternative}
                            />
                            <AvatarFallback className="aspect-square w-full flex-col gap-2 rounded-md bg-muted/80 text-muted-foreground">
                                <div className={cn('transition-color flex h-full w-full flex-col items-center justify-center rounded-xl p-8')}>
                                    <ImageIcon className="size-12" strokeWidth={1.25} />

                                    <div className="mt-4 flex flex-col items-center gap-1 text-center">
                                        <span className="text-base text-foreground">
                                            {currentLocale == 'kh' ? 'មិនមានរូបភាព' : 'No Image Available'}
                                        </span>
                                    </div>
                                </div>
                            </AvatarFallback>
                        </Avatar>
                    </PhotoView>
                ))}

                {/* Thumbnails */}
                {images?.length > 1 && (
                    <ScrollArea className="w-full rounded-none whitespace-nowrap sm:max-w-sm">
                        <div className="flex w-full justify-start space-x-2 pt-2">
                            {images.map((src, idx) => (
                                <img
                                    key={idx}
                                    src={src}
                                    alt={alternative}
                                    onClick={() => setMainImage(src)}
                                    className={`size-[90px] shrink-0 cursor-pointer rounded-none border object-cover transition-all ${
                                        src === mainImage ? 'border-primary' : 'opacity-70 hover:opacity-100'
                                    }`}
                                />
                            ))}
                        </div>

                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                )}
            </div>
        </PhotoProvider>
    );
}
