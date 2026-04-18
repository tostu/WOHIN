import { getDb } from '../db';
import { vibeFeedback } from '../db/schema';
import { eq, and, inArray } from 'drizzle-orm';

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
		await db
			.delete(vibeFeedback)
			.where(
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

	static async getVibeSummaryForLocations(d1: any, locationIds: string[]) {
		if (!locationIds.length) return {};
		const db = getDb(d1);
		
		const vibes = await db.select().from(vibeFeedback).where(
			inArray(vibeFeedback.locationId, locationIds)
		);

		const summary: Record<string, { rating: number; counts: Record<string, number> }> = {};
		
		locationIds.forEach(id => {
			summary[id] = { rating: 0, counts: { sparkle: 0, fire: 0, chill: 0, nope: 0 } };
		});

		vibes.forEach((v: any) => {
			if (summary[v.locationId]) {
				summary[v.locationId].counts[v.vibe]++;
			}
		});

		locationIds.forEach(id => {
			const s = summary[id];
			const total = s.counts.sparkle + s.counts.fire + s.counts.chill + s.counts.nope;
			if (total > 0) {
				// Score: Sparkle=5, Fire=4, Chill=3, Nope=1
				const score = (s.counts.sparkle * 5 + s.counts.fire * 4 + s.counts.chill * 3 + s.counts.nope * 1) / total;
				s.rating = Number(score.toFixed(1));
			} else {
				s.rating = 0;
			}
		});

		return summary;
	}
}
