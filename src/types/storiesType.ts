import {RefObject} from 'react';
import {CallbackProps, MultiStoryRef, UserProps} from 'react-native-story-view';

export interface IUserStories {
  id: string | number;
  userName: string;
  title: string;
  profile: string;
  status: boolean;
  stories: IStories[];
}

export interface IStories {
  id: string | number;
  url: string;
  type: 'image' | 'video' | '';
  duration: number;
  isReadMore: boolean;
  storyId: string | number;
  isSeen: boolean;
  showOverlay?: boolean;
  link?: string;
}

export interface HeaderProps extends Partial<CallbackProps>, UserProps {
  multiStoryRef?: RefObject<MultiStoryRef> | null;
  setIsStoryViewShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FooterProps extends Partial<CallbackProps> {}
