import PocketBase from 'pocketbase';

const pbUrl = 'http://127.0.0.1:8090';
export const pocketbaseClient = new PocketBase(pbUrl);
