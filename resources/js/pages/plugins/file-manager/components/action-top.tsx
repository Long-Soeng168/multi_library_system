import { TooltipButton } from '@/components/Button/TooltipButton';
import { Button } from '@/components/ui/button';
import useTranslation from '@/hooks/use-translation';
import { FilePlus2Icon, FolderPlusIcon } from 'lucide-react';

const ActionTop = ({ setOpenUploadFileDialog, setOpenAddFolderDialog }) => {
    const { t } = useTranslation();
    return (
        <>
            <TooltipButton tooltip="Upload Files">
                <Button title={t('Upload Files')} variant={`outline`} size={`icon`} onClick={() => setOpenUploadFileDialog(true)}>
                    <FilePlus2Icon className="stroke-primary" />
                </Button>
            </TooltipButton>

            <TooltipButton tooltip="Add Sub-Folder">
                <Button title={t('')} variant={`outline`} size={`icon`} onClick={() => setOpenAddFolderDialog(true)}>
                    <FolderPlusIcon className="stroke-warning" />
                </Button>
            </TooltipButton>
        </>
    );
};

export default ActionTop;
