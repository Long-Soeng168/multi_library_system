import FrontPageLayout from '@/layouts/FrontPageLayout';
import { router } from '@inertiajs/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function App() {
    const [flash, setFlash] = useState(false);
    const [error, setError] = useState(null);
    const [scanned, setScanned] = useState(false);

    const handleScan = (detectedCodes: any) => {
        if (!scanned && detectedCodes && detectedCodes.length > 0) {
            setScanned(true); // temporarily lock scanner
            const firstCode = detectedCodes[0];
            const value = firstCode.rawValue;

            console.log('Scanned QR:', value);
            setFlash(true);
            setTimeout(() => setFlash(false), 1000);

            try {
                // Navigate to check-in page
                router.visit('/student-checkin');
            } catch (err) {
                console.error('Error navigating:', err);
                // If error happens, unlock scanner so user can try again
                setScanned(false);
            }
        }
    };

    const handleError = (err: any) => {
        console.error('Scan error:', err);
        setError(err.message || 'Camera error');
        // Reset scanner on error
        setScanned(false);
    };

    return (
        <FrontPageLayout>
            <div className="flex flex-col items-center justify-center p-4 py-10">
                <h1 className="mb-4 text-2xl font-semibold">Attendance QR Scanner</h1>

                <div className={`mb-4 w-full max-w-md rounded-xl p-4 shadow-lg transition-all ${flash ? 'bg-green-200' : 'bg-white'}`}>
                    <Scanner onScan={handleScan} onError={handleError} />
                </div>

                {flash && <p className="mt-4 animate-pulse font-bold text-green-600">✅ QR Scanned!</p>}

                {error && <p className="mt-4 font-medium text-red-500">{error}</p>}
            </div>
        </FrontPageLayout>
    );
}
