import { User } from './User.model';

export interface Message {
    id: number;
    content: string;
    timestamp: string;
    user: User
}