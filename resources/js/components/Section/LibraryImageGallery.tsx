import React from 'react';

const LibraryImageGallery: React.FC = () => {
    return (
        <div className="w-full">
            <h2 className="py-8 text-center text-3xl font-bold">Gallery</h2>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((src, idx) => (
                    <div key={idx} className="overflow-hidden rounded">
                        <img
                            src={`/assets/sample_images/library${idx % 2 ? '2' : '1'}.jpg`}
                            alt={`Image ${idx + 1}`}
                            className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-115"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LibraryImageGallery;
