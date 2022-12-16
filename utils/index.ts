import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
export const ago = new TimeAgo('en-US');

export * from './breakpoint';
export * from './pocketbase';
export * from './types';
export * from './useNotification';
