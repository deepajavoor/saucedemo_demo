/**
 * Centralised user fixtures for SauceDemo's fixed set of demo accounts.
 * Kept as typed constants (not hardcoded strings in specs) so a change
 * to credentials or a new account only needs to be updated in one place.
 */
export interface SauceUser {
  username: string;
  password: string;
  description: string;
}

export const USERS: Record<string, SauceUser> = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    description: 'Fully functional happy-path account',
  },
  lockedOut: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    description: 'Valid credentials but account is disabled',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    description: 'Known UI bugs (wrong images) — useful for exploratory checks',
  },
  performanceGlitch: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    description: 'Introduces artificial latency',
  },
};

export const INVALID_CREDENTIALS = {
  username: 'standard_user',
  password: 'wrong_password_123',
};

export const NONEXISTENT_USER = {
  username: 'not_a_real_user',
  password: 'secret_sauce',
};
