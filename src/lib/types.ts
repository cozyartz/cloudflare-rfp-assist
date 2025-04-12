export type Role = 'user' | 'ai';

export interface Message {
  role: Role;
  content: string;
}

export type MessageArray = Message[];

export { Message, MessageArray, Role };
