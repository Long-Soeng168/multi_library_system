import AlertFlashMessage from '@/components/Alert/AlertFlashMessage';
import AllErrorsAlert from '@/components/Alert/AllErrorsAlert';
import SubmitButton from '@/components/Button/SubmitButton';
import { FormField } from '@/components/Input/FormField';
import { FormLabel } from '@/components/Input/FormLabel';
import { ProgressWithValue } from '@/components/ProgressBar/progress-with-value';
import PermissionGroupSelect from '@/components/Select/PermissionGroupSelect';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { useForm as inertiaUseForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Create() {
    const [flashMessage, setFlashMessage] = useState<{ message: string; type: string }>({
        message: '',
        type: 'message',
    });

    const { editData, readOnly, permissions } = usePage<any>().props;

    const { data, setData, post, put, progress, processing, transform, reset, errors } = inertiaUseForm({
        name: '',
        permissions: [],
    });

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>(data.permissions);

    // Initial Data
    useEffect(() => {
        editData?.name && setData('name', editData?.name);
        editData?.permissions &&
            setData(
                'permissions',
                editData?.permissions?.map((p: any) => p.id),
            );

        if (editData?.permissions) {
            setSelectedPermissions(editData.permissions.map((p: any) => p.id));
        }
    }, [editData]);

    // Toggle single permission
    const handlePermissionToggle = (id: number) => {
        setSelectedPermissions((prev) => (prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]));
    };

    // Toggle all in a group
    const handleGroupSelectAll = (group: any[]) => {
        const groupIds = group.map((p) => p.id);
        const allSelected = groupIds.every((id) => selectedPermissions.includes(id));

        setSelectedPermissions((prev) => (allSelected ? prev.filter((id) => !groupIds.includes(id)) : [...new Set([...prev, ...groupIds])]));
    };

    // Handle Submit
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        transform(() => ({
            ...data,
            permissions: selectedPermissions,
        }));

        if (editData?.id) {
            put(`/admin/roles/${editData.id}`, {
                preserveScroll: false,
                onSuccess: (page: any) => {
                    if (page.props.flash?.success) {
                        setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                    }
                },
            });
        } else {
            post('/admin/roles', {
                preserveScroll: false,
                onSuccess: (page: any) => {
                    reset();
                    setSelectedPermissions([]);
                    if (page.props.flash?.success) {
                        setFlashMessage({ message: page.props.flash?.success, type: 'success' });
                    }
                },
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Roles', href: '/admin/roles' },
        { title: editData?.name || 'Create', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <form onSubmit={onSubmit} className="form">
                <AlertFlashMessage
                    key={flashMessage.message}
                    type={flashMessage.type}
                    flashMessage={flashMessage.message}
                    setFlashMessage={setFlashMessage}
                />
                {errors && <AllErrorsAlert title="Please fix the following errors" errors={errors} />}

                <div className="form-field-container">
                    <FormField
                        id="name"
                        name="name"
                        label="Name"
                        value={data.name}
                        disable={data.name == 'Super Admin'}
                        onChange={(val: string) => setData('name', val)}
                        error={errors.name}
                    />
                </div>

                <FormLabel label="Permissions" />
                <div className="mt-1 mb-6 grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(permissions).map(([key, group]: [string, any], index) => (
                        <PermissionGroupSelect
                            key={index}
                            title={key}
                            permissions={group}
                            selected={selectedPermissions}
                            onToggle={handlePermissionToggle}
                            onSelectAll={handleGroupSelectAll}
                        />
                    ))}
                </div>

                {progress && <ProgressWithValue value={progress.percentage} position="start" />}
                {!readOnly && <SubmitButton processing={processing} />}
            </form>
        </AppLayout>
    );
}
