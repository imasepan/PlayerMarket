/*
TODO Let's create dedicated interface/class files or something later Depending on if we
TODO go functional or oop
 */

interface baseApiResponse {
  data: {
    platformInfo: PlatformInfo;
    userInfo: UserInfo;
    metadata: Metadata;
    segments: Segment[];
  };
}

interface SeasonApiResponse {
  data: SeasonData[];
}

interface PlatformInfo {
  platformSlug: string;
  platformUserId: string;
  platformUserHandle: string;
  platformUserIdentifier: string;
  avatarUrl: string;
  additionalParameters: any | null;
}

interface UserInfo {
  userId: string | null;
  isPremium: boolean;
  isVerified: boolean;
  isInfluencer: boolean;
  isPartner: boolean;
  countryCode: string | null;
  customAvatarUrl: string | null;
  customHeroUrl: string | null;
  customAvatarFrame: string | null;
  customAvatarFrameInfo: any | null;
  premiumDuration: number | null;
  socialAccounts: any[];
  badges: any | null;
  pageviews: number;
  xpTier: any | null;
  isSuspicious: boolean | null;
}

interface Metadata {
  activeShard: string;
  schema: string;
  privacy: string;
  defaultPlatform: string;
  defaultPlaylist: string;
  defaultSeason: string;
  premierRosterId: string | null;
  premierCrests: string | null;
  accountLevel: number;
  seasons: Season[];
  playlists: Playlist[];
}

interface Season {
  id: string;
  name: string;
  shortName: string;
  episodeName: string;
  actName: string;
  playlists: any | null;
}

interface Playlist {
  id: string;
  name: string;
  platform: string;
}

interface Segment {
  type: string;
  attributes: Record<string, any>;
  metadata: Record<string, any>;
  expiryDate: string;
  stats: Record<string, Stat>;
}

interface Stat {
  displayName: string;
  displayCategory: string;
  category: string;
  metadata: Record<string, any>;
  value: number | string | null;
  displayValue: string;
  displayType: string;
  percentile?: number;
  description?: string;
}

// charlie's additions

interface Stat {
  displayName: string;
  displayCategory: string;
  category: string;
  metadata: Record<string, any>;
  value: number;
  displayValue: string;
  displayType: string;
  percentile?: number;
}

interface SeasonAttributes {
  seasonId: string;
  playlist: string;
}

interface SeasonMetadata {
  name: string;
  shortName: string;
  playlistName: string;
  startTime: string;  // ISO string
  endTime: string;    // ISO string
  schema: string;
}

interface SeasonData {
  type: "season";
  attributes: SeasonAttributes;
  metadata: SeasonMetadata;
  expiryDate: string; // ISO string
  stats: {
    [key: string]: Stat; // keys like matchesPlayed, roundsWon, etc.
  };
}

// === Full API response ===
interface SeasonApiResponse {
  data: SeasonData[];
}