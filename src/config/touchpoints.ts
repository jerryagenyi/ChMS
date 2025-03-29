export const TOUCHPOINT_TYPES = {
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  EVENT: 'EVENT',
  REFERRAL: 'REFERRAL',
  ADVERTISING: 'ADVERTISING',
  OTHER: 'OTHER',
} as const;

export const TOUCHPOINT_SOURCES = {
  // Social Media
  FACEBOOK: 'FACEBOOK',
  INSTAGRAM: 'INSTAGRAM',
  TWITTER: 'TWITTER',
  TIKTOK: 'TIKTOK',
  LINKEDIN: 'LINKEDIN',
  YOUTUBE: 'YOUTUBE',

  // Referrals
  FRIEND: 'FRIEND',
  FAMILY: 'FAMILY',
  MEMBER: 'MEMBER',
  CO_WORKER: 'CO_WORKER',

  // Advertising
  POSTER: 'POSTER',
  BILLBOARD: 'BILLBOARD',
  RADIO: 'RADIO',
  TV: 'TV',
  NEWSPAPER: 'NEWSPAPER',
  MAGAZINE: 'MAGAZINE',

  // Other
  WEBSITE: 'WEBSITE',
  SEARCH_ENGINE: 'SEARCH_ENGINE',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  WALK_IN: 'WALK_IN',
} as const;

export type TouchpointType = typeof TOUCHPOINT_TYPES[keyof typeof TOUCHPOINT_TYPES];
export type TouchpointSource = typeof TOUCHPOINT_SOURCES[keyof typeof TOUCHPOINT_SOURCES];

export const TOUCHPOINT_LABELS: Record<TouchpointType, string> = {
  SOCIAL_MEDIA: 'Social Media',
  EVENT: 'Event',
  REFERRAL: 'Referral',
  ADVERTISING: 'Advertising',
  OTHER: 'Other',
};

export const SOURCE_LABELS: Record<TouchpointSource, string> = {
  // Social Media
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  TWITTER: 'Twitter',
  TIKTOK: 'TikTok',
  LINKEDIN: 'LinkedIn',
  YOUTUBE: 'YouTube',

  // Referrals
  FRIEND: 'Friend',
  FAMILY: 'Family',
  MEMBER: 'Church Member',
  CO_WORKER: 'Co-worker',

  // Advertising
  POSTER: 'Poster',
  BILLBOARD: 'Billboard',
  RADIO: 'Radio',
  TV: 'TV',
  NEWSPAPER: 'Newspaper',
  MAGAZINE: 'Magazine',

  // Other
  WEBSITE: 'Website',
  SEARCH_ENGINE: 'Search Engine',
  EMAIL: 'Email',
  SMS: 'SMS',
  WALK_IN: 'Walk-in',
}; 