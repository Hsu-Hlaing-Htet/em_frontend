import { useConfirm } from 'primevue/useconfirm';

export function useDeleteConfirm() {
    const confirm = useConfirm();

    const confirmDelete = (message, onAccept) => {
        confirm.require({
            message,
            header: 'Confirm Delete',
            icon: 'pi pi-trash text-red-500 text-xl',
            acceptLabel: 'Yes, delete it',
            rejectLabel: 'Cancel',
            acceptClass: 'p-button-danger',
            rejectClass: 'p-button-danger p-button-text',
            accept: onAccept,
        });
    };

    return { confirmDelete };
}
