import useTranslation from '@/hooks/use-translation';
import { usePage } from '@inertiajs/react';
import React from 'react';
import HtmlContentDisplay from '../Typography/HtmlContentDisplay';
import LibraryImageGallery from './LibraryImageGallery';

const LibraryAbout: React.FC = () => {
    const { showData } = usePage<any>().props;
    const { t, currentLocale } = useTranslation();

    return (
        <>
            <div className="sticky bg-background">
                <section>
                    <HtmlContentDisplay content={currentLocale === 'kh' ? showData?.about_kh || showData?.about : showData?.about} />
                </section>
                {/* <LibraryImageGallery /> */}
            </div>
        </>
    );
};

export default LibraryAbout;
