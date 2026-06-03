export interface Announcement {
    id: number;
    title: string;
    location: string;
    status: 'found' | 'lost';
    dateText: string;
    imageUrl?: string;
    description?: string;
}
