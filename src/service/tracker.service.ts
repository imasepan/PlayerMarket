import {PlaywrightService} from "./playwright.service.ts";
import type {Region} from "../enums/region.ts";

interface TrackerResponse<T> {
    data: T;
}

interface Playlist {
    value: string;
    label: string;
    platform: string;
    hasInsightData: boolean;
}

interface Season {
    id: string;
    name: string;
    shortName: string;
    startTime: string;
    endTime: string;
}

interface Episode extends Season{
    seasons: Season[];
}

interface Profile {
    platformInfo: PlatformInfo;
    userInfo: UserInfo;
    metadata: ProfileMetadata;
    segments: ProfileSegment[];
}

interface PlatformInfo {
    platformSlug: string;
    platformUserId: string;
    platformUserHandle: string;
    platformUserIdentifier: string;
    avatarUrl: string;
    additionalParameters: unknown;
}

interface Badge {
    titleSlug: string;
    userId: number;
    key: string;
    lootKey: unknown;
    tier: number;
    name: string;
    description: string;
    isGlobal: boolean;
    isStatTracker: boolean;
    badgeImageUrl: string;
    awardImageUrl: string;
    rarity: string;
    category: string;
    nextMilestone: string;
    dateAwarded: string;
    awarderId: unknown;
    seen: boolean;
}

interface UserInfo {
    userId: number;
    isPremium: boolean;
    isVerified: boolean;
    isInfluencer: boolean;
    isPartner: boolean;
    countryCode: string;
    customAvatarUrl: string | null;
    customHeroUrl: string | null;
    customAvatarFrame: unknown;
    customAvatarFrameInfo: unknown;
    premiumDuration: unknown;
    socialAccounts: unknown[];
    badges: Badge[];
    pageviews: number;
    xpTier: number;
    isSuspicious: unknown;
}

interface ProfileMetadata {
    activeShard: string;
    schema: string;
    privacy: string;
    defaultPlatform: string;
    defaultPlaylist: string;
    defaultSeason: string;
    premierRosterId: string | null;
    premierCrests: unknown;
    accountLevel: number;
    seasons: Season[];
    playlists: Playlist[];
}

interface ProfileSegmentAttributes {
    seasonId: string;
    playlist: string;
}

interface ProfileSegment {
    type: string;
    attributes: ProfileSegmentAttributes;
    metadata: unknown;
    expiryDate: string;
    stats: unknown;
    // ToDo
}

interface Leaderboard {
    id: string;
    metadata: LeaderboardMetadata;
    items: LeaderboardItem[];
}

interface LeaderboardMetadata {
    name: string;
    title: string;
    hasDistribution: boolean;
}

interface LeaderboardItem {
 // ToDo
}

export class TrackerService {
    private readonly playwright = new PlaywrightService();

    public async getPlaylists() {
        const response =  await this.playwright.fetch<TrackerResponse<Playlist[]>>("");
        return response.data;
    }

    public async getEpisodes() {
        const response = await this.playwright.fetch<TrackerResponse<Episode[]>>("");
        return response.data.sort((a, b) => {
            const aStart = new Date(a.startTime).getTime();
            const bStart = new Date(b.startTime).getTime();
            return aStart - bStart;
        });
    }

    public async getSeasons() {
        const episodes = await this.getEpisodes();
        return episodes
            .flatMap(episode => episode.seasons)
            .sort((a, b) => {
                const aStart = new Date(a.startTime).getTime();
                const bStart = new Date(b.startTime).getTime();
                return aStart - bStart;
            });
    }

    public async getLeaderboard(region: Region, seasonId: string, take: number = 100, skip: number = 0) {
        if (take > 100) {
            throw new Error("Cannot take more than 100 ");
        }
        if (take < 0) {
            throw new Error("Cannot take less than 0");
        }
        if (skip < 0) {
            throw new Error("Cannot skip less than 0");
        }
        const response = await this.playwright.fetch<TrackerResponse<Leaderboard>>("");
        return response.data;
    }

    public async getProfile(username: string) {
        const response = await this.playwright.fetch<TrackerResponse<Profile>>("");
        return response.data;
    }
}