import useTranslation from '@/hooks/use-translation';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { useEffect } from 'react';

const SearchByGoogle = () => {
    const { t, currentLocale } = useTranslation();
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cse.google.com/cse.js?cx=...';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Change Place holder text
    useEffect(() => {
        let attempts = 0;
        const checkExist = setInterval(() => {
            const searchInput = document.getElementById('gsc-i-id1') as HTMLInputElement;

            if (searchInput) {
                searchInput.placeholder = currentLocale === 'kh' ? 'ស្វែងរកសកល...' : 'Global Search...';
                clearInterval(checkExist);
            }

            // Stop trying after 5 seconds so we don't waste resources
            attempts++;
            if (attempts > 50) clearInterval(checkExist);
        }, 100);

        return () => clearInterval(checkExist); // Cleanup on unmount
    }, [currentLocale]);

    return (
        <FrontPageLayout>
            <div>
                <div className="section-container mx-auto my-10">
                    {/* Scoped CSS to modernize the Google Widget */}
                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
/* Target the specific Google input ID or class */
#gsc-i-id1, .gsc-input {
    background: none !important; /* Removes the Google logo background */
}

/* ============================================================
   1. GLOBAL LAYOUT & CONTAINER RESETS
   ============================================================ */
.gsc-control-cse {
    background-color: transparent !important;
    border: none !important;
    padding: 0 !important;
    font-family: inherit !important;
}

form.gsc-search-box {
    max-width: 100%;
    margin: 0 !important;
}

.gsc-wrapper {
    max-width: 100%;
}

.gsc-above-wrapper-area {
    max-width: 100% !important;
}

/* Allow the input cell to grow and the button cell to stay fixed */
td.gsc-input { 
    flex-grow: 1 !important; 
    padding: 0 !important; 
}

td.gsc-search-button { 
    display: block !important; 
    padding: 0 !important; 
    background: transparent !important;
}

/* ============================================================
   2. SEARCH INPUT BOX STYLES (LIGHT MODE)
   ============================================================ */
.gsc-input-box {
    border: 1px solid #4f46e5 !important;
    border-radius: 16px !important;
    background: #ffffff !important;
    padding: 8px 5px !important;
    overflow: hidden !important;
    transition: all 0.3s ease !important;
}

.gsc-input-box:focus-within, 
.gsc-input-box-focus {
    border-color: #4f46e5 !important;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15) !important;
    outline: none !important;
}

/* ============================================================
   3. SEARCH BUTTON STYLES (LIGHT MODE)
   ============================================================ */
button.gsc-search-button-v2 {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    background-color: #6366f1 !important;
    border-radius: 12px !important;
    height: 74.5px !important; 
    min-width: 71px !important;
    margin: 0 0 0 10px !important;
    border: none !important;
    transition: background 0.2s ease !important;
    cursor: pointer !important;
}

button.gsc-search-button-v2:hover {
    background-color: #4f46e5 !important;
}

button.gsc-search-button-v2 svg {
    width: 24px !important;
    height: 24px !important;
    fill: #ffffff !important;
}

/* ============================================================
   4. SEARCH RESULTS STYLES (LIGHT MODE)
   ============================================================ */
.gsc-webResult.gsc-result {
    padding: 24px !important;
    margin-bottom: 12px !important;
    border: 1px solid #f1f5f9 !important;
    border-radius: 16px !important;
    background-color: #ffffff !important;
    transition: all 0.2s ease !important;
}

.gsc-webResult.gsc-result:hover {
    border-color: #6366f1 !important;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.1) !important;
    transform: translateY(-2px);
}

.gs-title, 
.gs-title * {
    color: #4f46e5 !important;
    text-decoration: none !important;
    font-weight: 600 !important;
}

.gs-title:hover {
    text-decoration: underline !important;
}

.gs-snippet {
    font-size: 14px !important;
    line-height: 1.6 !important;
    color: #64748b !important;
}

.gsc-webResult-divider {
    display: none !important;
}

.gsc-thumbnail-inside, 
.gsc-url-top {
    padding-left: 0 !important;
    margin-bottom: 4px !important;
}

/* ============================================================
   5. PAGINATION, FOOTER & CLUTTER CLEANUP
   ============================================================ */
.gsc-cursor-box {
    border: none !important;
    display: flex !important;
    justify-content: center !important;
}
.gsc-resultsRoot .gsc-results .gsc-cursor-box {
    margin: 0 !important;
}
    /* 1. Reset the outer box */
.gsc-cursor-box {
    margin-top: 20px !important;
    border: none !important;
    width: 100% !important;
    display: block !important; /* Let the inner div handle flex */
}

/* 2. Target the actual container of the buttons */
.gsc-cursor {
    display: flex !important;
    flex-wrap: wrap !important; /* This is the fix */
    justify-content: center !important;
    gap: 5px !important;
    height: auto !important;
    padding: 10px 0 !important;
}

/* 3. Ensure buttons don't shrink */
.gsc-cursor-page {
    flex-shrink: 0 !important;
    min-width: 40px !important; /* Keeps them as nice squares/rectangles */
    text-align: center !important;
}

.gsc-cursor-page {
    background-color: #ffffff !important;
    border: 1px solid #e5e5e5 !important;
    color: #4f46e5 !important;
    padding: 8px 16px !important;
    border-radius: 10px !important;
    text-decoration: none !important;
    font-weight: 600 !important;
    transition: all 0.2s ease !important;
    margin-right: 0 !important;
}

.gsc-cursor-current-page {
    background-color: #6366f1 !important;
    color: white !important;
    border-color: #6366f1 !important;
}
.dark .gsc-results .gsc-cursor-box .gsc-cursor-current-page {
    background-color: #fff !important;
    color: #6366f1 !important;
    border-color: #6366f1 !important;
}

.gsc-cursor-page:hover:not(.gsc-cursor-current-page) {
    background-color: #f8fafc !important;
    border-color: #6366f1 !important;
}

.gcsc-branding, 
.gsc-adBlock, 
.gcsc-more-maybe-branding-root { 
    display: none !important; 
}

/* ============================================================
   6. DARK MODE OVERRIDES (.dark)
   ============================================================ */
.dark .gsc-control-cse,
.dark .gsc-control-wrapper-cse,
.dark .gsc-resultsbox-visible {
    background-color: transparent !important;
    border: none !important;
}

/* Dark Input Box Area */
.dark .gsc-input-box {
    background-color: #1e293b8f !important; 
    border-color: #6466f180 !important;    
}

.dark .gsc-input-box:focus-within, 
.dark .gsc-input-box-focus {
    border-color: #4f46e5 !important;
    outline: none !important;
}

.dark #gsc-i-id1 {
    background-color: transparent !important;
    filter: brightness(0);
}

/* Dark Icons & Interaction */
.dark .gsib_a, 
.dark .gscb_a {
    filter: invert(1);
} 

.dark .gsst_a .gscb_a {
    color: #94a3b8 !important;
}

/* Dark Tabs */
.dark .gsc-tabHeader.gsc-tabhActive {
    background-color: transparent !important;
    border-color: #6366f1 !important;
    color: #ffffff !important;
}

.gsc-tabHeader {
    padding: 14px 14px !important;
    margin: 0 0 !important;
}
.dark .gsc-tabHeader {
    padding: 14px 14px !important;
    margin: 0 0 !important;
}

.dark .gsc-tabHeader.gsc-tabhInactive {
    background-color: transparent !important;
    color: #94a3b8 !important;
}

/* Dark Results Card */
.dark .gsc-webResult.gsc-result {
    background-color: #1e293b !important; 
    border-color: #6466f180 !important;    
    box-shadow: none !important;
}

.dark .gsc-webResult.gsc-result:hover {
    background-color: #1e293b !important;
    border-color: #818cf8 !important; 
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
}

.dark .gs-title, 
.dark .gs-title *,
.dark .gs-title b {
    color: #818cf8 !important; 
    text-decoration: none !important;
}

.dark .gs-title:hover {
    text-decoration: underline !important;
}

.dark .gs-snippet, 
.dark .gs-snippet * {
    color: #cbd5e1 !important; 
}

.dark .gs-fileFormatType {
    color: #94a3b8 !important;
}

.dark .gs-visibleUrl {
    color: #34d399 !important; 
}

/* Dark Result Info & Ordering */
.dark .gsc-result-info,
.dark .gsc-orderby-label,
.dark .gsc-selected-option-container {
    color: #94a3b8 !important;
}

/* Dark Pagination */
.dark .gsc-cursor-page {
    background-color: #0f172a !important; 
    border-color: #6466f180 !important;
    color: #818cf8 !important;
}

/* Dark Footer & Branding */
.dark .gcsc-find-more-on-google {
    background-color: #1e293b !important;
    color: #f8fafc !important;
    border: 1px solid #6466f180 !important;
}

.dark .gcsc-find-more-on-google-magnifier {
    fill: #f8fafc !important;
}

.dark .gcsc-find-more-on-google-query {
    color: #818cf8 !important;
}

.dark .gcsc-branding-img-noclear {
    filter: invert(1) brightness(0.8);
}

.dark .gsc-webResult-divider {
    border-bottom: 1px solid #1e293b !important;
}

.dark .gsc-search-button-v2 svg {
    fill: #ffffff !important;
}
    
            `,
                        }}
                    />

                    <div className="relative mb-8 flex flex-col items-center px-4 text-center sm:mb-12">
                        {/* Heading: Fluid typography from 3xl (mobile) to 5xl (desktop) */}
                        <h2 className="relative bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-3xl leading-relaxed font-bold text-transparent sm:text-4xl">
                            {currentLocale == 'kh' ? 'ស្វែងរកសកល' : 'Global Search'}
                        </h2>

                        {/* Badge Area: Adjusted gaps and line widths for small screens */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="h-[1.5px] w-6 rounded-full bg-gradient-to-r from-transparent to-indigo-500 sm:h-[2px] sm:w-12"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-medium whitespace-nowrap text-muted-foreground/70 uppercase sm:text-base">
                                    {currentLocale == 'kh' ? 'ដំណើរការដោយ' : 'Powered by'}
                                </span>
                                {/* Google Logo Image: Precisely sized to match text cap-height */}
                                <div className="flex items-center">
                                    <img
                                        src="/assets/icons/google_logo.png"
                                        alt="Google"
                                        className="h-[14px] w-auto brightness-95 filter sm:h-[18px]"
                                    />
                                </div>
                            </div>

                            <div className="h-[1.5px] w-6 rounded-full bg-gradient-to-l from-transparent to-indigo-500 sm:h-[2px] sm:w-12"></div>
                        </div>
                    </div>

                    <div className="bg-background backdrop-blur-sm md:rounded-3xl md:border md:p-8">
                        <div className="gcse-search"></div>
                    </div>
                </div>
            </div>
        </FrontPageLayout>
    );
};

export default SearchByGoogle;
