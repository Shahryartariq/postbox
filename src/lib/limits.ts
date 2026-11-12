// Shared between the UI and the copy. The same numbers are enforced in firestore.rules.
export const QUESTION_MAX = 200;
export const REPLY_MAX = 500;
export const REPLY_COOLDOWN_SECONDS = 10;
export const QUESTION_COOLDOWN_SECONDS = 30;

/** 8 characters, no look-alikes (0/o, 1/l/i). Matches the rule in firestore.rules. */
export const ID_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
export const ID_PATTERN = /^[2-9a-hjkmnp-z]{8}$/;
