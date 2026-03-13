import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CircleCheck, Edit, Eye, Plus, Trash } from 'lucide-react';

const actionIcons: Record<string, React.ElementType> = {
    create: Plus,
    view: Eye,
    update: Edit,
    delete: Trash,
};
interface PermissionGroupSelectProps {
    title: string;
    permissions: { id: number; name: string }[];
    selected: number[];
    onToggle: (id: number) => void;
    onSelectAll: (permissions: { id: number; name: string }[]) => void;
}

const PermissionGroupSelect = ({ title, permissions, selected, onToggle, onSelectAll }: PermissionGroupSelectProps) => {
    const allSelected = permissions.length > 0 && permissions.every((p) => selected.includes(p.id));

    return (
        <div className="rounded-lg border-[1px] border-border p-4 ring-primary/20 transition-all duration-300 hover:border-primary hover:ring-4 dark:border-primary/50 dark:hover:border-primary">
            {/* Group Header */}
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">{title.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</h2>

                {permissions.length > 0 && (
                    <CheckboxPrimitive.Root
                        checked={allSelected}
                        onCheckedChange={() => onSelectAll(permissions)}
                        className={cn(
                            'relative flex cursor-pointer items-center gap-2 rounded px-4 py-2 text-sm text-muted-foreground ring-[1px] ring-border transition-all data-[state=checked]:text-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                        )}
                    >
                        <span>Select All</span>
                        <CheckboxPrimitive.Indicator className="absolute -top-2 -right-2 border-none">
                            <CircleCheck className="size-5 fill-primary text-primary-foreground" />
                        </CheckboxPrimitive.Indicator>
                    </CheckboxPrimitive.Root>
                )}
            </div>

            {/* Permissions */}
            {permissions.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                    {permissions.map((p) => (
                        <CheckboxPrimitive.Root
                            key={p.id}
                            checked={selected.includes(p.id)}
                            onCheckedChange={() => onToggle(p.id)}
                            className={cn(
                                'relative cursor-pointer rounded px-2 py-3 text-center text-muted-foreground ring-[1px] ring-border data-[state=checked]:text-primary data-[state=checked]:ring-2 data-[state=checked]:ring-primary',
                            )}
                        >
                            {/* Icon (if matches Create/View/Update/Delete) */}
                            <div className="flex items-center justify-center gap-1">
                                {(() => {
                                    const actionWord = p.name.split(' ').slice(-1)[0].toLowerCase();
                                    const Icon = actionIcons[actionWord];
                                    return Icon ? <Icon className="size-4" /> : null;
                                })()}

                                <span className="font-medium tracking-tight">{p.name.split(' ').slice(-1)[0]}</span>
                            </div>
                            <CheckboxPrimitive.Indicator className="absolute top-0 right-0">
                                <CircleCheck className="size-5 fill-primary text-primary-foreground" />
                            </CheckboxPrimitive.Indicator>
                        </CheckboxPrimitive.Root>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic">No permissions in this group</p>
            )}
        </div>
    );
};

export default PermissionGroupSelect;
