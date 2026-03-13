import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Headphones, Library, Video } from 'lucide-react';
import { MotionHighlight } from '../animate-ui/effects/motion-highlight';
import SmallOverlayTopRightButton from '../Button/SmallOverlayTopRightButton';

const CARDS = [
    { value: '1', icon: FileText, title: 'Theses' },
    { value: '2', icon: Library, title: 'Publications' },
    { value: '3', icon: Headphones, title: 'Audios' },
    { value: '4', icon: BookOpen, title: 'Research Paper' },
    { value: '5', icon: Video, title: 'Videos' },
    // { value: '6', icon: Newspaper, title: 'News Articles' },
    // { value: '7', icon: Presentation, title: 'Presentations' },
    // { value: '8', icon: ScrollText, title: 'Reports' },
];

export default function ResourceMainCategoryVertical({ className = '' }) {
    return (
        <div className="mx-auto flex max-w-full flex-col gap-[16px]">
            <MotionHighlight hover className="rounded-md">
                {CARDS.map((card) => (
                    <Link key={card.value} href={`/resources/theses`}>
                        <div data-value={card.value} className="group rela relative h-full w-full cursor-pointer overflow-hidden">
                            <div className="flex h-full flex-col items-center justify-center rounded-md border p-4 transition-all duration-300 hover:border-primary hover:shadow-md">
                                <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-muted">
                                    <card.icon className="size-10 text-true-primary" />
                                </div>
                                <p className="mb-1 text-lg font-medium">{card.title}</p>
                                <p className="text-base text-muted-foreground">1200+ {card.title}</p>

                                {/* Hover icon overlay */}
                                <SmallOverlayTopRightButton className="bg-primary/20 text-primary" iconSize={5} />
                            </div>
                        </div>
                    </Link>
                ))}
            </MotionHighlight>
        </div>
    );
}
