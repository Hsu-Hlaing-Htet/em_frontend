import EventBus from '@/libs/AppEventBus';

const notifyPdfAction = (detail) => {
    EventBus.emit('show-toast', {
        severity: 'info',
        summary: '',
        detail,
    });
};

export const downloadPdf = () => notifyPdfAction('PDF download will be available when backend is connected.');
export const exportPdf = () => notifyPdfAction('PDF export will be available when backend is connected.');
export const sendEmail = () => notifyPdfAction('Email delivery will be available when backend is connected.');
export const printContract = () => window.print();
