import { Badge } from '../ui/badge';

const roleClasses: Record<string, string> = {
    'Super Admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-50',
    Admin: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-50',
    Editor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-50',
    User: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-50',
    Publisher: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-50',
    Author: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-50',
    Advisor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-50',
};

const RoleBadge = ({ title }: { title: string }) => {
    const classes = roleClasses[title] || 'bg-gray-200 text-black';

    return <Badge className={`rounded-sm px-2 py-1 ${classes}`}>{title}</Badge>;
};

export default RoleBadge;
