import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import useTranslation from '@/hooks/use-translation';
import { PlusSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function PWAInstallPrompt() {
    const { t } = useTranslation();

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isMacSafari, setIsMacSafari] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1. Standard Device Detection
        const ua = window.navigator.userAgent.toLowerCase();
        const ios = /iphone|ipad|ipod/.test(ua) || (ua.includes('mac') && 'ontouchend' in document);
        setIsIOS(ios);

        const macSafari = ua.includes('macintosh') && ua.includes('safari') && !ua.includes('chrome');
        setIsMacSafari(macSafari);

        const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
        setIsStandalone(standalone);

        // 2. Persistent Check (For Inertia navigation)
        // If the event was already captured on a previous page, re-apply it to state
        if ((window as any).savedPrompt) {
            setDeferredPrompt((window as any).savedPrompt);
            setVisible(true);
        }

        // 3. Android/Chrome Listener
        const handler = (e: any) => {
            e.preventDefault();
            // Save to both local state and global window object
            (window as any).savedPrompt = e;
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        // Check both local state and the global window object
        const prompt = deferredPrompt || (window as any).savedPrompt;

        if (!prompt) return;

        prompt.prompt();
        const { outcome } = await prompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ User accepted install');
            // Clean up both to ensure the prompt doesn't show again
            (window as any).savedPrompt = null;
            setDeferredPrompt(null);
            setVisible(false);
        } else {
            console.log('❌ User dismissed install');
        }
    };

    // Already installed → don’t show anything
    if (isStandalone) return null;

    // Android/Chrome flow
    if (visible && deferredPrompt && !isIOS && !isMacSafari) {
        return (
            <div className="flex w-full flex-col items-center border-t border-dashed border-white/50 py-2">
                <span className="mb-2 text-sm font-medium">{t('Install this app for quick access')}</span>
                <Button
                    className="flex w-fit items-center gap-2 bg-white font-semibold text-true-primary transition-all duration-300 hover:scale-105 hover:bg-gray-100"
                    variant="secondary"
                    onClick={handleInstall}
                >
                    <img className="size-5" src="/assets/icons/app-download-icon.png" alt="Install" />
                    {t('Install')}
                </Button>
            </div>
        );
    }

    // iOS Safari flow
    if (isIOS && !isStandalone) {
        return (
            <div className="flex w-full flex-col items-center border-t border-dashed border-white/50 py-3">
                <span className="mb-2 text-sm font-medium">{t('Install this app for quick access')}</span>
                <Button
                    className="flex w-fit items-center gap-2 bg-white font-semibold text-true-primary transition-all duration-300 hover:scale-105 hover:bg-gray-100"
                    variant="secondary"
                    onClick={() => setOpenDialog(true)}
                >
                    <img className="size-5" src="/assets/icons/app-download-icon.png" alt="Install" />
                    {t('Install')}
                </Button>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="space-y-4 sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{t('Install App')}</DialogTitle>
                            <DialogDescription>{t('Follow these steps to add this app to your iPhone or iPad home screen:')}</DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-3">
                            <div>
                                {t('1. Tap the')}
                                <Badge variant="outline" className="mx-2 inline-flex items-center gap-1 text-sm">
                                    Share <img className="size-5" src="/assets/icons/ios-share.png" alt="Share" />
                                </Badge>
                                {t('at the bottom in Safari')}
                            </div>

                            <div>
                                {t('2. Scroll down and tap')}
                                <Badge variant="outline" className="mx-2 inline-flex items-center gap-1 text-sm">
                                    Add to Home Screen <PlusSquare className="ml-0.5" />
                                </Badge>
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                                {t('After adding, the app will appear on your home screen like a native app.')}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    // macOS Safari flow
    if (isMacSafari && !isStandalone) {
        return (
            <div className="flex w-full flex-col items-center border-t border-dashed border-white/50 py-3">
                <span className="mb-2 text-sm font-medium">{t('Install this app for quick access')}</span>
                <Button
                    className="flex w-fit items-center gap-2 bg-white font-semibold text-true-primary"
                    variant="secondary"
                    onClick={() => setOpenDialog(true)}
                >
                    <img className="size-5" src="/assets/icons/app-download-icon.png" alt="Install" />
                    {t('Install')}
                </Button>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('Install on Mac')}</DialogTitle>
                            <DialogDescription>
                                {t('In Safari, go to the menu bar')} → <b>File</b> → <b>Add to Dock</b>.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return null;
}
