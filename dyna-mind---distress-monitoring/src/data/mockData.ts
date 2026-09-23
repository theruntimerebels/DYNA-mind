import { ChatMessage, BiometricIndicators } from '../types';

export const ASSETS = {
  emblem:
    'https://lh3.googleusercontent.com/aida/AEtjO1XWGDQqRez0z6c-kXRjboj7jXGGzCHsKs5qUryCGKQC_qI57NtvdQLKoN7YWEyvTiSjmd0sxGQ4fqP2Isgl_q9mgkaaMLAGkSYaJcKdMk5gVHwPZ0DpB9ntf-qUzUB4zfJNwDVMOvPrZp6CrNdKzZmG71RBYwdnaoFx02hC95cm483ft36HikAYaYKDJm73gv_tm0W_L8F1CTQKW_vqYeF8lG-Fj_Qyl3pjnxXnnAohM99GCdF1gw_c2Hq8',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDMTOZisUCIRf9merpkg6aFgQXuPzkpjfgnHO06NE59MHfmGd70wvvMAjjGHvPHFktmCF2qUCynrEI_wNj4rz6IQttPVapBFqzEryHbDEKtf8e9UnmTbuZTFmWPMpnRZVoPIQrYYBFH_oRVLKtqTWfPD_ONK08aBlVM9zTB9-1pk3aMUw8QM-iovGjbyg3YveqJe05foqGyB5eomoOsICJZfxxcIVj622ZGVpIyAXDUBpsWMXsz3Sx_gg',
  sanctuary:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCjdZTAfUt31wZUgAe8YY4aLoVXpawaCsO3YbXZbcncXQ6Ci15Lej_N5LP4lcp-doPgH1uHA-1qYt9RYoBYzgl4SlOJZyh7h2TQEFhftWStjMk7fuNkP8PqKNS9o65LgOLX435JNTQBswjGnzqzi5L_Mec5vNeRQWOYcRaqG4RjD5kvwLJzDFphNnmXvPzZBv2p5QtDTqkHPbtgHL-zUcd1fT7NCjpkaFe7OirDr7LWLEqFqTuusRXtgA',
  wellnessSpace:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBhPt0GLktXv4X4pN2-x3BYWmkrO_C2TqjpQoAsmgsglI2xfeUKpMP0F8GBpkWyVbkqMJU61oGk-4Ej4Pju6oT8l_z_eOPkspsuPjJQ_f9wYjKoGIKy-0BDjnlERdueklPgKYTzAsDp1c2y-b7LdgJy6RCix8oe7d-hYZtGKjobLwL2pjywJRol3iRX7fpX6cwREHKcaJyc5dooiUhujq-4TrOeCKoKg54_1f1qni1gqSDniEnFKGMVuQ',
  sarahMitchell:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuApiBMGuEOOim6c1B3gw6UzIJ9ZgPP_pNXG5weUX-RDkGd-O5dc4ZIBaBTWkj2X1GXVqxzEAVHys28ld6yOZFVQmq4ozvYG0PIbFI7InZj2b_fYMfQEQ54aFFoaA3w6luW7fbM7u_20rzCmgY9ix85m-kJX2IyC7wNBG-65aHDMVALJ_jZvUWCQdtic01yXPecwoPzmGe7iucpN4jdYYrW_RlaMAlJJTk4cBKITZ5atA0iIKoOo_J20iw',
};

export const INITIAL_BIOMETRICS: BiometricIndicators = {
  distressIndex: 34,
  sleepHours: 6.8,
  stabilityQuotient: 82,
  deviationVariance: 14,
  stabilityState: 'Anchored',
  calibratedLogs: 14,
  stressResponse: 72,
  sleepIntegrity: 58,
  wellbeingScore: 64,
};

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'companion',
    text: 'Hi Elena. I am here with you. Take your time, breathe at your own pace, and tell me: how is your headspace feeling this morning?',
    time: '09:42 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'I have been feeling intense chest tightness and dread about the upcoming court hearing next Tuesday.',
    time: '09:44 AM',
    status: 'Delivered',
  },
  {
    id: 'msg-3',
    sender: 'companion',
    text: 'Facing legal proceedings creates an immense somatic load. That chest tightness is your nervous system doing its best to shield you. Would you like to unpack what feels most intimidating about Tuesday, or shall we try a two-minute grounding exercise first?',
    time: '09:44 AM',
  },
];

export const ARCHIVED_SESSIONS = [
  {
    id: 'arch-1',
    title: 'Morning somatic grounding & anxiety check',
    meta: 'Today, 08:15 AM • 12 interactions',
  },
  {
    id: 'arch-2',
    title: 'Legal proceedings anticipation debrief',
    meta: 'Yesterday, 04:30 PM • 28 interactions',
  },
  {
    id: 'arch-3',
    title: 'Evening stabilization & sleep hygiene',
    meta: 'May 14, 09:40 PM • 16 interactions',
  },
  {
    id: 'arch-4',
    title: 'Cross-examination cognitive reframing',
    meta: 'May 11, 02:10 PM • 22 interactions',
  },
];
