import { getDb } from '../db';
import { favorite } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export class FavoritesService {
	static async toggle(d1: any, userId: string, locationId: string) {
		const db = getDb(d1);
		const existing = await db
			.select()
			.from(favorite)
			.where(and(eq(favorite.userId, userId), eq(favorite.locationId, locationId)))
			.limit(1);

		if (existing.length > 0) {
			await db
				.delete(favorite)
				.where(and(eq(favorite.userId, userId), eq(favorite.locationId, locationId)));
			return { favorited: false };
		}

		await db.insert(favorite).values({ userId, locationId });
		return { favorited: true };
	}

	static async getMyFavorites(d1: any, userId: string) {
		const db = getDb(d1);
		return db.select().from(favorite).where(eq(favorite.userId, userId));
	}

	static async isFavorited(d1: any, userId: string, locationId: string) {
		const db = getDb(d1);
		const result = await db
			.select()
			.from(favorite)
			.where(and(eq(favorite.userId, userId), eq(favorite.locationId, locationId)))
			.limit(1);
		return result.length > 0;
	}
}
