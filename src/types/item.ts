export interface Item {
    id: number;
    title: string;
    description?: string;
    category: string;
    location: string;
    status: 'found' | 'lost';
    dateFound: string;
    isReturned: boolean;
    imageUrl?: string;
    ownerId?: number;
}
