import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { AlertCircle, Zap } from 'lucide-react';
import React from 'react';

interface LimitReachedDialogProps {
    title?: string;
    description?: string;
    trigger?: React.ReactNode;
}

const LimitReachedDialog = ({
    title = 'Plan Limit Reached',
    description = "You've reached the maximum limit for your current plan. Upgrade now to continue adding more items and unlock premium features.",
    trigger,
}: LimitReachedDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger || (
                    <Button
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400"
                    >
                        <AlertCircle className="mr-2 h-4 w-4" />
                        Limit Reached
                    </Button>
                )}
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-[400px]">
                <AlertDialogHeader className="flex flex-col items-center text-center">
                    {/* Icon Header */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>

                    <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>

                    <AlertDialogDescription className="text-sm text-muted-foreground">{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-4 flex-col gap-2 sm:flex-row sm:justify-center">
                    <AlertDialogCancel className="sm:flex-1">Maybe Later</AlertDialogCancel>
                    <AlertDialogAction asChild className="bg-primary hover:bg-primary/90 sm:flex-1">
                        <Link href="/pricing" className="flex items-center gap-2">
                            <Zap className="h-4 w-4 fill-current" />
                            View Plans
                        </Link>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LimitReachedDialog;
