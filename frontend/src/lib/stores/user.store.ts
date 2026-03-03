import { writable } from 'svelte/store';

// faire un type user plus tard dans domain
export const userStore = writable<any | null>(null);
