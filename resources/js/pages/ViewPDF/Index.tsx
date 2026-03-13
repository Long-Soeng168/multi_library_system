import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Link, usePage } from '@inertiajs/react';
import { ProgressBar, Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { ChevronLeftIcon } from 'lucide-react';
// import './view-pdf-custom.css';

export default function PdfViewer() {
    const { appearance } = useAppearance();
    const { fileUrl, previousRoute, canDownload } = usePage<any>().props;

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar: (ToolbarSlot) => {
            // Keep all default buttons
            return (
                <div className="rpv-toolbar">
                    <Link href={previousRoute || '/'}>
                        <Button type="button" className="mx-1 rounded-sm has-[>svg]:pl-1.5 gap-0 h-8">
                            <ChevronLeftIcon />
                            Back
                        </Button>
                    </Link>
                    <ToolbarSlot />

                    {/* Add your custom button */}
                </div>
            );
        },
    });

    return (
        <div className="h-[100dvh]">
            {/* Direct CSS inside the component */}
            {canDownload ? (
                <style>{`
                button[data-testid='print__menu'],
                button[data-testid='print__button'],

                button[data-testid='open__menu'],
                button[data-testid='open__button'] {
                    display: none !important;
                }

                .rpv-toolbar__item div {
                    display: flex !important;
                }

                #rpv-default-layout__sidebar-tab-1,
                #rpv-default-layout__sidebar-tab-2 {
                    display: none !important;
                }
            `}</style>
            ) : (
                <style>{`
                button[data-testid='print__menu'],
                button[data-testid='print__button'],

                button[data-testid='get-file__download-menu'],
                button[data-testid='get-file__download-button'],

                button[data-testid='open__menu'],
                button[data-testid='open__button'] {
                    display: none !important;
                }

                .rpv-toolbar__item div {
                    display: flex !important;
                }

                #rpv-default-layout__sidebar-tab-1,
                #rpv-default-layout__sidebar-tab-2 {
                    display: none !important;
                }
            `}</style>
            )}

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    theme={appearance == 'system' ? 'light' : appearance}
                    fileUrl={fileUrl}
                    renderLoader={(percentages: number) => (
                        <div style={{ width: '240px' }}>
                            <ProgressBar progress={Math.round(percentages)} />
                        </div>
                    )}
                    plugins={[defaultLayoutPluginInstance]}
                />
            </Worker>
        </div>
    );
}
