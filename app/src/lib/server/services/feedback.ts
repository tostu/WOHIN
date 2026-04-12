import { getDb } from '../db';
import { vibeFeedback } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export interface VibeSubmission {
	userId: string;
	locationId: string;
	activityId: string;
	vibe: 'sparkle' | 'fire' | 'chill' | 'nope';
}

export class FeedbackService {
	static async submitVibe(d1: any, data: VibeSubmission) {
		const db = getDb(d1);
		
		// UPSERT: delete existing vibe from this user for this location/activity if any
		await db.delete(vibeFeedback).where(
			and(
				eq(vibeFeedback.userId, data.userId),
				eq(vibeFeedback.locationId, data.locationId),
				eq(vibeFeedback.activityId, data.activityId)
			)
		);

		return db.insert(vibeFeedback).values(data).returning();
	}

	static async getVibesForLocation(d1: any, locationId: string) {
		const db = getDb(d1);
		return db.select().from(vibeFeedback).where(eq(vibeFeedback.locationId, locationId));
	}

	static async getMyVibes(d1: any, userId: string) {
		const db = getDb(d1);
		return db.select().from(vibeFeedback).where(eq(vibeFeedback.userId, userId));
	}
}
