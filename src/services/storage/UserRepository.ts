import type { StorageInterface } from "./StorageInterface";
import type { UserProfile } from "../../store/userStore";

export class UserRepository {
	private storage: StorageInterface;
	private readonly KEY = "puretone-user-profile";

	constructor(storage: StorageInterface) {
		this.storage = storage;
	}

	async getProfile(): Promise<UserProfile | null> {
		return this.storage.getItem<UserProfile>(this.KEY);
	}

	async saveProfile(profile: UserProfile): Promise<void> {
		return this.storage.setItem(this.KEY, profile);
	}
}
