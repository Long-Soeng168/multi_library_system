import usePermission from '@/hooks/use-permission';
import useTranslation from '@/hooks/use-translation';
import { useForm } from '@inertiajs/react';
import { RefreshCwIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import SpanCellDate from '../Table/SpanCellDate';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { TooltipButton } from './TooltipButton';

const RecoverItem = ({ recoverPath, permission, deleted_at }: { recoverPath: string; permission?: string; deleted_at?: any }) => {
    const hasPermission = usePermission();
    if (permission && !hasPermission(permission)) {
        return null;
    }

    const { post, processing } = useForm();

    const handleRecover = () => {
        post(recoverPath, {
            preserveScroll: true,
            onSuccess: (page: any) => {
                if (page.props.flash?.success) {
                    toast.success('Success', {
                        description: page.props.flash.success,
                    });
                }
                if (page.props.flash?.error) {
                    toast.error('Error', {
                        description: page.props.flash.error,
                    });
                }
            },
            onError: (e: any) => {
                toast.error('Error', {
                    description: 'Failed to recover: ' + JSON.stringify(e, null, 2),
                });
            },
        });
    };
    const { t } = useTranslation();
    return (
        <div className="flex items-start gap-2">
            <div className="flex flex-col items-center">
                <Badge variant="destructive" className="rounded bg-destructive/80">
                    <Trash2Icon />
                    {t('Item Deleted')}
                </Badge>
                <SpanCellDate
                    className="p-0"
                    value={deleted_at}
                    options={{ year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }}
                />
            </div>
            <TooltipButton tooltip="Recover Item" side="bottom">
                <Button variant="default" size="icon" className={`rounded`} onClick={handleRecover} disabled={processing}>
                    <RefreshCwIcon className={` ${processing ? 'animate-spin' : ''}`} />
                </Button>
            </TooltipButton>
        </div>
    );
};

export default RecoverItem;
