import type { StorageInterface } from "./StorageInterface";

export class LocalStorageAdapter implements StorageInterface {
	async getItem<T>(key: string): Promise<T | null> {
		const item = localStorage.getItem(key);
		if (!item) return null;
		try {
			return JSON.parse(item) as T;
		} catch {
			return null;
		}
	}

	async setItem<T>(key: string, value: T): Promise<void> {
		localStorage.setItem(key, JSON.stringify(value));
	}

	async removeItem(key: string): Promise<void> {
		localStorage.removeItem(key);
	}
}

export const storage = new LocalStorageAdapter();
