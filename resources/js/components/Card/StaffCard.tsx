import { User } from 'lucide-react';

export default function StaffCard({ name, name_kh, role, imageUrl }) {
    return (
        <div className="w-36 transform overflow-hidden rounded border border-border bg-background transition-transform hover:scale-105 hover:shadow-xl">
            {/* Image Section 3:4 */}
            <div className="relative aspect-[3/3.1] w-full">
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="h-full w-full object-cover object-top" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <User className="size-16 text-primary" strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {/* Name & Role */}
            <div className="p-2 text-center">
                <h3 className="text-[clamp(0.75rem,2.5vw,1rem)] font-semibold whitespace-nowrap text-foreground">{name_kh}</h3>
                <h3 className="text-[clamp(0.65rem,2vw,0.875rem)] whitespace-nowrap text-muted-foreground">{role}</h3>
                {/* <p className="mt-1 text-xs text-gray-500">{role}</p> */}
            </div>
        </div>
    );
}

// Usage
// <StaffCard name="John Doe" role="Software Engineer" imageUrl="https://yourimage.com/photo.jpg" />
// <StaffCard name="Jane Smith" role="Marketing Lead" />
