export const postStatusData: any[] = [
    { label: 'Published', value: 'published', color: 'green', description: 'Visible to everyone.' },
    { label: 'Unpublished', value: 'unpublished', color: 'gray', description: 'Hidden from public.' },
];

export const itemStatusData: any[] = [
    { label: 'Available', value: 'available', color: 'green', description: 'Item is on shelf and ready for loan.' },
    { label: 'Not For Loan', value: 'not_for_loan', color: 'orange', description: 'Reference only or restricted material.' },
    { label: 'Checked Out', value: 'checked_out', color: 'blue', description: 'Currently with a borrower.' },
    { label: 'Damaged', value: 'damaged', color: 'yellow', description: 'Requires repair before it can be loaned.' },
    { label: 'Lost', value: 'lost', color: 'red', description: 'Item cannot be located.' },
    { label: 'Removed', value: 'removed', color: 'gray', description: 'Permanently withdrawn from the collection.' },
];

export const LIBRARY_STATUS_OPTIONS = [
    {
        value: 'in_review',
        label: 'In Review',
        description: 'The library is pending approval and is not yet public.',
    },
    {
        value: 'active',
        label: 'Active',
        description: 'The library is live and fully operational.',
    },
    {
        value: 'suspended',
        label: 'Suspended',
        description: 'Access is temporarily disabled due to maintenance or policy issues.',
    },
    {
        value: 'expired',
        label: 'Expired',
        description: 'The library subscription or listing has ended.',
    },
];
