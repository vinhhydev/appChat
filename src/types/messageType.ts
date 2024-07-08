export interface IMessage {
  userId: string;
  userName: string;
  message: string;
  path: string;
  type: 'image' | 'video';
  newMessage: boolean;
  createAt: string;
}
