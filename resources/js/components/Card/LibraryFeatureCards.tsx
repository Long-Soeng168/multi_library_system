import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { BookOpenIcon, CalendarCheckIcon, HeartIcon, SettingsIcon } from 'lucide-react';

const features = [
    {
        title: 'Your Attendance',
        desc: 'View your check-in history and track library visits.',
        icon: CalendarCheckIcon,
    },
    {
        title: 'Recent Reads',
        desc: 'See the books and materials you recently accessed.',
        icon: BookOpenIcon,
    },
    {
        title: 'Favorites',
        desc: 'Easily find and manage your saved books or resources.',
        icon: HeartIcon,
    },
    {
        title: 'Settings',
        desc: 'Personalize your account.',
        icon: SettingsIcon,
    },
];

export default function LibraryFeatureCards() {
    return (
        <div className="my-10 grid gap-4">
            {features.map(({ title, desc, icon: Icon }) => (
                <Card
                    key={title}
                    className="relative flex flex-row items-center gap-4 border-border p-4 py-2 shadow-none transition hover:border-primary/50"
                >
                    <div className="shrink-0">
                        <Icon className="size-8 text-primary opacity-90" />
                    </div>
                    <div className="p-0">
                        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">{desc}</CardDescription>
                    </div>
                </Card>
            ))}
        </div>
    );
}
