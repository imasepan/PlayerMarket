import {PlaywrightService} from "./playwright.service.ts";
import type {Region} from "../enums/region.ts";
import {getEnv} from "../util/env.ts";

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
    id: string;
    owner: LeaderboardItemOwner;
    value: number;
    displayValue: string;
    rank: number;
    percentile: unknown | null;
    iconUrl: string | null;
}

interface LeaderboardItemOwner {
    id: string;
    type: string;
    metadata: LeaderboardItemOwnerMetadata;
    stats: LeaderboardItemOwnerStat[];
}

interface LeaderboardItemOwnerMetadata {
    platformId: number;
    platformSlug: string;
    platformUserHandle: string;
    platformUserIdentifier: string;
    platformUserRegion: string;
    countryCode: string;
    pictureUrl: string;
    avatarUrl: string;
    customAvatarFrameInfo: unknown | null;
    isPremium: boolean;
    premiumDuration: unknown | null;
    twitch: string;
    twitter: string;
    isLive: boolean;
    isPrivate: boolean;
    previousPosition: LeaderboardItemOwnerMetadataPreviousPosition;
    topAgents: LeaderboardItemOwnerMetadataAgent[];
}

interface LeaderboardItemOwnerStat {
    metadata: LeaderboardItemOwnerStatMetadata;
    percentile: unknown | null;
    rank: unknown | null;
    displayPercentile: unknown | null;
    displayRank: unknown | null;
    description: unknown | null;
    value: string;
    displayValue: string;
}

interface LeaderboardItemOwnerStatMetadata {
    key: string;
    name: string;
    description: unknown | null;
    categoryKey: unknown | null;
    isReversed: boolean;
    iconUrl: string | null;
    color: unknown | null;
    value: unknown | null;
    displayValue: unknown | null;
}

interface LeaderboardItemOwnerMetadataPreviousPosition {
    rank: number;
    value: number;
    competitiveTier: number;
}

interface LeaderboardItemOwnerMetadataAgent {
    name: string;
    imageUrl: string;
    matchesPlayed: number;
}


export class TrackerService {
    private readonly playwright = new PlaywrightService();
    private apiUrl = getEnv("API_URL");

    public async getPlaylists() {
        console.debug("Scrapping playlists");
        const url = this.apiUrl + "/v1/valorant/db/playlists/";
        const response =  await this.playwright.fetch<TrackerResponse<Playlist[]>>(url);
        return response.data;
    }

    public async getEpisodes() {
        console.debug("Scrapping episodes");
        const url = this.apiUrl + "/v1/valorant/db/seasons/";
        const response = await this.playwright.fetch<TrackerResponse<Episode[]>>(url);
        return response.data.sort((a, b) => {
            const aStart = new Date(a.startTime).getTime();
            const bStart = new Date(b.startTime).getTime();
            return aStart - bStart;
        });
    }

    public async getSeasons() {
        console.debug("Scrapping seasons");
        const episodes = await this.getEpisodes();
        return episodes
            .flatMap(episode => episode.seasons)
            .sort((a, b) => {
                const aStart = new Date(a.startTime).getTime();
                const bStart = new Date(b.startTime).getTime();
                return aStart - bStart;
            });
    }

    public async getLeaderboard(region: Region, seasonId: string, skip: number = 0, take: number = 100, ) {
        console.debug(`Scrapping leaderboard: region=${region}, seasonId=${seasonId} skip=${skip}, take=${take}`);
        if (take > 100) {
            throw new Error("Cannot take more than 100 ");
        }
        if (take < 0) {
            throw new Error("Cannot take less than 0");
        }
        if (skip < 0) {
            throw new Error("Cannot skip less than 0");
        }
        const url = this.apiUrl + `/v1/valorant/standard/leaderboards?type=ranked&platform=pc&region=${region}&act=${seasonId}&skip=${skip}&take=${take}`
        const response = await this.playwright.fetch<TrackerResponse<Leaderboard>>(url);
        return response.data;
    }

    public async getProfile(username: string) {
        console.debug(`Scrapping profile: username=${username}`);
        const url = this.apiUrl + `/v2/valorant/standard/profile/riot/${encodeURIComponent(username)}`;
        const response = await this.playwright.fetch<TrackerResponse<Profile>>(url);
        return response.data;
    }
}