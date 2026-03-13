import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function StudentCheckin() {
    // Static sample data
    const student = {
        name: 'Long Soeng',
        studentId: 'ST-00123',
        checkinTime: '2025-10-25 08:30 AM',
        status: 'Checked In',
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
                <h1 className="mb-4 text-3xl font-bold">Student Check-In</h1>

                <div className="mb-6 rounded-xl bg-green-100 p-4">
                    <p className="text-lg font-semibold text-green-700">✅ Check-In Successful!</p>
                </div>

                <div className="mb-10 space-y-2 text-left">
                    <p>
                        <span className="font-semibold">Name:</span> {student.name}
                    </p>
                    <p>
                        <span className="font-semibold">Student ID:</span> {student.studentId}
                    </p>
                    <p>
                        <span className="font-semibold">Check-In Time:</span> {student.checkinTime}
                    </p>
                    <p>
                        <span className="font-semibold">Status:</span> <span className="font-bold text-green-600">{student.status}</span>
                    </p>
                </div>
                <div className='flex gap-2 justify-end'>
                    <Link href="/scan-qr">
                        <Button variant="outline">Back to Scanner</Button>
                    </Link>
                    <Link href="/">
                        <Button>Home Page</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
