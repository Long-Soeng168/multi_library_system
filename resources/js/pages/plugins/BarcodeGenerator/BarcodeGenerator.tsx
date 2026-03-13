import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import { cn } from '@/lib/utils';

import html2canvas from 'html2canvas-pro';
import JsBarcode from 'jsbarcode';
import { jsPDF } from 'jspdf';
import { Loader2 } from 'lucide-react'; // Added for better UX
import { useEffect, useRef, useState } from 'react';

const MAX_QUANTITY = 200; // Define your safety limit here

/* ---------------- SAFE CANVAS CLONE ---------------- */
const sanitizeForCanvas = (node: HTMLElement) => {
    const elements = node.querySelectorAll('*');
    elements.forEach((el) => {
        const s = window.getComputedStyle(el as Element);
        const style = (el as HTMLElement).style;
        if (s.color.includes('oklch') || s.color.includes('color-mix')) style.color = '#000';
        if (s.backgroundColor.includes('oklch') || s.backgroundColor.includes('color-mix')) style.backgroundColor = '#fff';
        if (s.borderColor.includes('oklch') || s.borderColor.includes('color-mix')) style.borderColor = '#ccc';
        style.boxShadow = 'none';
        style.filter = 'none';
        style.backdropFilter = 'none';
    });
};

const BarcodeGenerator = () => {
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false); // New state

    const [config, setConfig] = useState({
        orgName: 'MY LIBRARY',
        startNo: '000001',
        quantity: 10,
        cols: 4,
        rows: 10,
        barcodeHeight: 45,
        showValue: true,
        padding: 10,
    });

    // Helper to handle quantity changes safely
    const handleQuantityChange = (val: string) => {
        let num = parseInt(val) || 0;
        if (num > MAX_QUANTITY) num = MAX_QUANTITY; // Force max limit
        setConfig({ ...config, quantity: num });
    };

    const generateCodes = () => {
        const codes = [];
        const startInt = parseInt(config.startNo, 10) || 0;
        const length = config.startNo.length;
        for (let i = 0; i < config.quantity; i++) {
            codes.push((startInt + i).toString().padStart(length, '0'));
        }
        return codes;
    };

    const codesByPage = () => {
        const codes = generateCodes();
        const perPage = config.rows * config.cols;
        const pages = [];
        for (let i = 0; i < codes.length; i += perPage) {
            pages.push(codes.slice(i, i + perPage));
        }
        return pages;
    };

    /* ---------------- EXPORT PDF (FIXED BUG) ---------------- */
    const handleDownloadPDF = async () => {
        // Query only the visible preview pages
        const pages = document.querySelectorAll('.barcode-page-clone');
        if (pages.length === 0) return;

        setIsExporting(true);

        try {
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true,
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < pages.length; i++) {
                const pageElement = pages[i] as HTMLElement;

                // We don't change display to 'grid' or 'none' anymore
                // because the preview is already visible and we want it to stay that way.
                sanitizeForCanvas(pageElement);

                const canvas = await html2canvas(pageElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    imageTimeout: 0,
                });

                const imgData = canvas.toDataURL('image/jpeg', 1);

                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            }

            pdf.save(`barcodes-${config.startNo}.pdf`);
        } catch (error) {
            console.error('Export Error:', error);
        } finally {
            // This is the key: stop the loading state so user can export again
            // and because we removed style.display = 'none', the barcodes stay visible!
            setIsExporting(false);
        }
    };

    return (
        <FrontPageLayout>
            <div className="section-container flex min-h-screen flex-col gap-6 bg-muted/20 p-4 py-6 lg:flex-row">
                <Card className="h-fit w-full shrink-0 shadow-none lg:w-80">
                    <CardHeader>
                        <CardTitle className="text-xl">Barcode Generator</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Organization Name</Label>
                            <Input
                                disabled={isExporting}
                                value={config.orgName}
                                onChange={(e) => setConfig({ ...config, orgName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Number</Label>
                            <Input
                                disabled={isExporting}
                                value={config.startNo}
                                onChange={(e) => setConfig({ ...config, startNo: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label>Total Quantity</Label>
                                <span
                                    className={cn(
                                        'rounded px-1.5 py-0.5 text-[10px] font-bold',
                                        config.quantity >= MAX_QUANTITY ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600',
                                    )}
                                >
                                    Max: {MAX_QUANTITY}
                                </span>
                            </div>
                            <Input
                                disabled={isExporting}
                                type="number"
                                value={config.quantity}
                                min={1}
                                max={MAX_QUANTITY}
                                onChange={(e) => handleQuantityChange(e.target.value)}
                            />
                            {config.quantity >= MAX_QUANTITY && (
                                <p className="text-[10px] font-medium text-red-500">Limit reached to prevent browser crash.</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-t pt-4">
                            <div className="space-y-2">
                                <Label>Columns</Label>
                                <Input
                                    disabled={isExporting}
                                    type="number"
                                    value={config.cols}
                                    onChange={(e) => setConfig({ ...config, cols: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Rows</Label>
                                <Input
                                    disabled={isExporting}
                                    type="number"
                                    value={config.rows}
                                    onChange={(e) => setConfig({ ...config, rows: parseInt(e.target.value) || 1 })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Barcode Height ({config.barcodeHeight}px)</Label>
                            <Input
                                disabled={isExporting}
                                type="range"
                                min="20"
                                max="100"
                                value={config.barcodeHeight}
                                onChange={(e) => setConfig({ ...config, barcodeHeight: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="flex items-center space-x-2 border-t pt-4">
                            <Checkbox
                                disabled={isExporting}
                                checked={config.showValue}
                                id="show_text"
                                onCheckedChange={(c) => setConfig({ ...config, showValue: !!c })}
                            />
                            <Label htmlFor="show_text">Show text</Label>
                        </div>
                        <Button className="mt-4 w-full" size="lg" onClick={handleDownloadPDF} disabled={isExporting}>
                            {isExporting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Export PDF`
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <div className="flex-1 space-y-8 overflow-auto rounded-lg bg-muted p-4 py-6 dark:bg-zinc-800">
                    {codesByPage().map((pageCodes, pageIdx) => (
                        <div key={pageIdx} className="relative">
                            <p className="mb-2 text-center text-xs text-muted-foreground uppercase">Page {pageIdx + 1}</p>
                            <div
                                style={{
                                    width: '210mm',
                                    minHeight: '297mm',
                                    background: '#fff',
                                    padding: '10mm',
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                                    gridAutoRows: `calc(277mm / ${config.rows})`,
                                    gap: `${config.padding}px`,
                                    color: '#000',
                                }}
                                className="barcode-page-clone mx-auto"
                            >
                                {pageCodes.map((code) => (
                                    <div
                                        key={code}
                                        style={{ border: '1px dashed #ddd' }}
                                        className="flex flex-col items-center justify-center overflow-visible bg-white p-1 pb-[7.5px]"
                                    >
                                        <span style={{ fontSize: '10px' }} className="mb-1 w-full truncate text-center font-semibold">
                                            {config.orgName}
                                        </span>
                                        <BarcodeItem value={code} height={config.barcodeHeight} showValue={config.showValue} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div></div>
                </div>
            </div>
        </FrontPageLayout>
    );
};

const BarcodeItem = ({ value, height, showValue }: { value: string; height: number; showValue: boolean }) => {
    const ref = useRef<SVGSVGElement>(null);
    useEffect(() => {
        if (!ref.current) return;
        JsBarcode(ref.current, value, {
            format: 'CODE128',
            height,
            displayValue: showValue,
            margin: 0,
            width: 2,
            fontSize: 14,
            background: '#fff',
            lineColor: '#000',
        });
    }, [value, height, showValue]);
    return <svg ref={ref} className="h-auto max-w-full" />;
};

export default BarcodeGenerator;
