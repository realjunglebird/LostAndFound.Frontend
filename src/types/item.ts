export interface Item {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  campusId: number;
  status: 'found' | 'lost';
  dateFound: string;
  isReturned: boolean;
  imageUrl?: string;
  ownerId?: number;
}
