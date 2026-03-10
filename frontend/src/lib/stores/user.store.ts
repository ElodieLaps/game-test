import type { User } from '$lib/domain/user/types';
import { writable } from 'svelte/store';

export const userStore = writable<User | null>(null);
