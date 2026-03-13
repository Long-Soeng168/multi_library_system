import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import FrontPageLayout from '@/layouts/FrontPageLayout';
import html2canvas from 'html2canvas-pro';
import { Download, ImageIcon, Link2, QrCodeIcon, RefreshCw, Type, Wifi } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

const QRCodeGenerator = () => {
    const qrRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [qrType, setQrType] = useState('link');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [inputs, setInputs] = useState({
        link: 'https://',
        text: '',
        wifiSsid: '',
        wifiPass: '',
        wifiSec: 'WPA',
    });

    const [config, setConfig] = useState({
        value: 'https://',
        fgColor: '#000000',
        bgColor: '#ffffff',
        level: 'H',
        size: 260,
        padding: 20, // Kept as requested
        borderRadius: 12, // Kept as requested
        logoSize: 50,
        includeLogo: false,
        label: 'SCAN ME',
    });

    useEffect(() => {
        let newValue = '';
        if (qrType === 'link') newValue = inputs.link;
        else if (qrType === 'text') newValue = inputs.text;
        else if (qrType === 'wifi') {
            newValue = `WIFI:S:${inputs.wifiSsid};T:${inputs.wifiSec};P:${inputs.wifiPass};;`;
        }
        setConfig((prev) => ({ ...prev, value: newValue || ' ' }));
    }, [inputs, qrType]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
                setConfig((prev) => ({ ...prev, includeLogo: true }));
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadPNG = async () => {
        if (!qrRef.current) return;
        const canvas = await html2canvas(qrRef.current, {
            scale: 3,
            backgroundColor: null,
            logging: false,
        });
        const link = document.createElement('a');
        link.download = `qr-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    return (
        <FrontPageLayout>
            <div className="flex min-h-screen flex-col items-center bg-slate-50 p-4 py-6 dark:bg-zinc-950">
                <div className="section-container grid w-full gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
                    {/* SETTINGS PANEL */}
                    <Card className="order-2 gap-0 overflow-hidden border-none py-0 lg:order-1 dark:bg-muted/30">
                        <CardHeader className="border-b bg-white px-4 py-4 md:px-6 dark:bg-zinc-900">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary md:text-2xl">
                                <QrCodeIcon className="size-8" />
                                QR Code Generator
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 md:p-6">
                            <Tabs defaultValue="content" className="space-y-6">
                                <TabsList className="w-full">
                                    <TabsTrigger value="content" className="w-full dark:data-[state=active]:bg-white/10">
                                        Data
                                    </TabsTrigger>
                                    <TabsTrigger value="design" className="w-full dark:data-[state=active]:bg-white/10">
                                        Style
                                    </TabsTrigger>
                                    <TabsTrigger value="logo" className="w-full dark:data-[state=active]:bg-white/10">
                                        Logo
                                    </TabsTrigger>
                                </TabsList>

                                {/* TAB: CONTENT */}
                                <TabsContent value="content" className="space-y-4 outline-none">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold">Select Type</Label>
                                        <div className="flex gap-2 rounded-lg bg-muted/40 p-1">
                                            {[
                                                { id: 'link', icon: Link2, label: 'Link' },
                                                { id: 'text', icon: Type, label: 'Text' },
                                                { id: 'wifi', icon: Wifi, label: 'Wi-Fi' },
                                            ].map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setQrType(item.id)}
                                                    className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition-all ${
                                                        qrType === item.id
                                                            ? 'bg-white shadow-sm dark:bg-zinc-800'
                                                            : 'text-muted-foreground hover:bg-white/50 dark:hover:bg-zinc-800/50'
                                                    }`}
                                                >
                                                    <item.icon className="size-3.5" />
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {qrType === 'link' && (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">URL Address</Label>
                                                <Input
                                                    value={inputs.link}
                                                    onChange={(e) => setInputs({ ...inputs, link: e.target.value })}
                                                    placeholder="https://..."
                                                    className="h-11"
                                                />
                                            </div>
                                        )}
                                        {qrType === 'text' && (
                                            <div className="space-y-2">
                                                <Label className="text-xs font-semibold">Message Content</Label>
                                                <Textarea
                                                    value={inputs.text}
                                                    onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
                                                    placeholder="Enter text..."
                                                    className="min-h-[100px] resize-none"
                                                />
                                            </div>
                                        )}
                                        {qrType === 'wifi' && (
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">SSID (Network Name)</Label>
                                                    <Input
                                                        value={inputs.wifiSsid}
                                                        onChange={(e) => setInputs({ ...inputs, wifiSsid: e.target.value })}
                                                        placeholder="e.g. Library_Guest"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-semibold">Password (Optional)</Label>
                                                    <Input
                                                        type="password"
                                                        value={inputs.wifiPass}
                                                        onChange={(e) => setInputs({ ...inputs, wifiPass: e.target.value })}
                                                        className=""
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 space-y-2 border-t border-dashed border-primary/50 pt-4">
                                        <Label className="text-xs font-semibold">Bottom Label Text</Label>
                                        <Input
                                            value={config.label}
                                            onChange={(e) => setConfig({ ...config, label: e.target.value })}
                                            className="h-11"
                                        />
                                    </div>
                                </TabsContent>

                                {/* TAB: DESIGN */}
                                <TabsContent value="design" className="space-y-6 outline-none">
                                    <div className="space-y-3">
                                        <Label className="text-xs font-semibold">Color Palette</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-3 rounded-md border bg-white p-2 dark:bg-zinc-900">
                                                <Input
                                                    type="color"
                                                    className="size-8 cursor-pointer overflow-hidden border-none p-0"
                                                    value={config.fgColor}
                                                    onChange={(e) => setConfig({ ...config, fgColor: e.target.value })}
                                                />
                                                <span>{config.fgColor}</span>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-md border bg-white p-2 dark:bg-zinc-900">
                                                <Input
                                                    type="color"
                                                    className="size-8 cursor-pointer overflow-hidden border-none p-0"
                                                    value={config.bgColor}
                                                    onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                                                />
                                                <span>{config.bgColor}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 border-t pt-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-semibold">Space Outside</Label>
                                                <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px]">{config.padding}px</span>
                                            </div>
                                            <Slider
                                                value={[config.padding]}
                                                min={10}
                                                max={100}
                                                step={1}
                                                onValueChange={([val]) => setConfig({ ...config, padding: val })}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-xs font-semibold">Round Corners</Label>
                                                <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px]">{config.borderRadius}px</span>
                                            </div>
                                            <Slider
                                                value={[config.borderRadius]}
                                                min={0}
                                                max={60}
                                                step={1}
                                                onValueChange={([val]) => setConfig({ ...config, borderRadius: val })}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* TAB: LOGO */}
                                <TabsContent value="logo" className="space-y-4 outline-none">
                                    <div className="space-y-4">
                                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/20 p-8 text-center">
                                            {logoPreview ? (
                                                <div className="group relative">
                                                    <img src={logoPreview} alt="Logo" className="size-24 rounded-lg object-contain" />
                                                    <button
                                                        onClick={() => {
                                                            setLogoPreview(null);
                                                            setConfig((p) => ({ ...p, includeLogo: false }));
                                                        }}
                                                        className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full bg-red-500 text-white transition-transform hover:scale-110"
                                                    >
                                                        <RefreshCw size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mb-4 rounded-full bg-white p-4 dark:bg-zinc-800">
                                                        <ImageIcon className="size-8 text-primary" />
                                                    </div>
                                                    <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                        Choose Logo File
                                                    </Button>
                                                    <p className="mt-2 text-[10px] text-muted-foreground uppercase">PNG, JPG or SVG (Max 2MB)</p>
                                                </>
                                            )}
                                            <input type="file" ref={fileInputRef} hidden onChange={handleLogoUpload} accept="image/*" />
                                        </div>

                                        {logoPreview && (
                                            <div className="space-y-6 border-t pt-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-bold uppercase">Logo Size</Label>
                                                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px]">
                                                            {config.logoSize}px
                                                        </span>
                                                    </div>
                                                    <Slider
                                                        value={[config.logoSize]}
                                                        min={20}
                                                        max={80}
                                                        step={1}
                                                        onValueChange={([val]) => setConfig({ ...config, logoSize: val })}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                                                    <input
                                                        type="checkbox"
                                                        id="logo-toggle"
                                                        checked={config.includeLogo}
                                                        onChange={(e) => setConfig({ ...config, includeLogo: e.target.checked })}
                                                        className="size-4 accent-primary"
                                                    />
                                                    <Label htmlFor="logo-toggle" className="cursor-pointer text-xs font-bold uppercase">
                                                        Enable Logo Overlay
                                                    </Label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="mt-8">
                                <Button onClick={downloadPNG} size="lg" className="text-md h-12 w-full font-bold transition-all active:scale-95">
                                    <Download className="mr-2 size-5" /> Download PNG
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* PREVIEW PANEL */}
                    <div className="order-1 flex flex-col items-center justify-center space-y-6 lg:sticky lg:top-10 lg:order-2">
                        <div className="flex flex-col items-center">
                            <div
                                ref={qrRef}
                                style={{
                                    backgroundColor: config.bgColor,
                                    padding: `${config.padding}px`,
                                    borderRadius: `${config.borderRadius}px`,
                                    maxWidth: '100%',
                                }}
                                className="flex flex-col items-center ring-1 ring-black/5"
                            >
                                <div className="relative flex items-center justify-center">
                                    <QRCodeSVG
                                        value={config.value}
                                        size={config.size}
                                        fgColor={config.fgColor}
                                        bgColor={config.bgColor}
                                        level="H" // Forced high for reliability
                                        includeMargin={false}
                                        className="h-auto max-w-full"
                                        imageSettings={
                                            config.includeLogo && logoPreview
                                                ? {
                                                      src: logoPreview,
                                                      height: config.logoSize,
                                                      width: config.logoSize,
                                                      excavate: true,
                                                  }
                                                : undefined
                                        }
                                    />
                                </div>

                                {config.label && (
                                    <div className="mt-5 px-4 text-center">
                                        <p
                                            className="text-[10px] leading-tight font-black tracking-[0.4em] uppercase md:text-xs"
                                            style={{ color: config.fgColor }}
                                        >
                                            {config.label}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-full bg-white/80 px-4 py-1.5 text-center ring-1 ring-black/5 backdrop-blur dark:bg-zinc-900/80">
                            <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Live Preview</p>
                            <p className="max-w-[240px] truncate font-mono text-[9px] text-zinc-500 italic">{config.value}</p>
                        </div>
                    </div>
                </div>
            </div>
        </FrontPageLayout>
    );
};

export default QRCodeGenerator;
