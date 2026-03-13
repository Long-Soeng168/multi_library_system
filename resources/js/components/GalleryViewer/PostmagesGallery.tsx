import { cn } from '@/lib/utils';
import { ImagesIcon, Maximize2Icon, Minimize2Icon, RotateCwSquareIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

// const sample_images = [
//     { image: '/assets/rule_library/meeting/1.jpeg' },
//     { image: '/assets/rule_library/meeting/2.jpeg' },
//     { image: '/assets/rule_library/meeting/3.jpeg' },
//     { image: '/assets/rule_library/meeting/4.jpeg' },
// ];

interface UploadedImageProps {
    label?: string;
    containerClassName?: string;
    imageContainerClassName?: string;
    imageClassName?: string;
    images?: any[];
    basePath?: string; // default: "/assets/images/thumb/"
}

export default function PostmagesGallery({
    containerClassName,
    imageContainerClassName,
    imageClassName,
    label = 'Images',
    images,
    basePath = '/assets/images/thumb/',
}: UploadedImageProps) {
    if (!images) return null;

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
        >
            <div className={cn('grid content-start gap-2', containerClassName)}>
                <h2 className="flex items-center font-bold gap-1 text-base">
                    <ImagesIcon size={18} />
                    {label}
                </h2>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                    {images.map((objectImage: any) => (
                        <PhotoView key={objectImage?.id} src={basePath + objectImage.image}>
                            <img
                                src={basePath + 'thumb/' + (objectImage?.image || '')}
                                alt={`Image ${objectImage?.id}`}
                                className="mt-0 border mb-0 aspect-4/3 w-full cursor-pointer rounded-sm object-cover transition-transform duration-300 group-hover:scale-105 hover:scale-105"
                            />
                        </PhotoView>
                    ))}
                </div>
            </div>
        </PhotoProvider>
    );
}
