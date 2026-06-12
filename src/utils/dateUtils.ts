export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
