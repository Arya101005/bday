/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THREE OF US — the only file you need to edit.
 *
 *  Everything the website shows lives here: names, photos, voice notes, quiz
 *  questions, the Moon text, the letter and the final gift.
 *
 *  Asset paths are relative to the `public/` folder, e.g.
 *      src: '/images/memories/mem-1.png'
 *  Leave any `src` as an empty string ('') and the site shows a graceful
 *  "not uploaded yet" placeholder instead of breaking.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface MemoryPhoto {
  id: string;
  src: string;
  caption: string;
  date: string;
  contributor: string;
}

export interface VoiceWish {
  id: string;
  friendName: string;
  src: string;
  avatarSrc: string;
  intro: string;
  transcript: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface GiftConfig {
  title: string;
  revealMessage: string;
  imageSrc: string;
  videoSrc: string;
  clue: string;
  finalInstruction: string;
  finalMessage: string;
}

const FRIEND_NAMES = ['Arya', 'Gaytri', 'Harini'];

const RECIPIENT = 'Sam';

/**
 * Real photos, split into small strips that sit *between* sections rather than
 * one big gallery. Photos are anonymous on purpose — no names, no captions,
 * nothing pinned to a person. Add or remove freely; the strips adapt.
 */
const allPhotos: MemoryPhoto[] = [
  { id: 'mem-1', src: '/images/memories/mem-1.png', caption: '', date: '', contributor: '' },
  { id: 'mem-2', src: '/images/memories/mem-2.png', caption: '', date: '', contributor: '' },
  { id: 'mem-3', src: '/images/memories/mem-3.png', caption: '', date: '', contributor: '' },
  { id: 'mem-4', src: '/images/memories/mem-4.png', caption: '', date: '', contributor: '' },
  { id: 'mem-5', src: '/images/memories/mem-5.png', caption: '', date: '', contributor: '' },
  { id: 'mem-6', src: '/images/memories/mem-6.png', caption: '', date: '', contributor: '' },
  { id: 'mem-7', src: '/images/memories/mem-7.png', caption: '', date: '', contributor: '' },
  { id: 'mem-8', src: '/images/memories/mem-8.png', caption: '', date: '', contributor: '' },
  { id: 'mem-9', src: '/images/memories/mem-9.png', caption: '', date: '', contributor: '' },
  { id: 'mem-10', src: '/images/memories/mem-10.jpeg', caption: '', date: '', contributor: '' },
  { id: 'two', src: '/images/memories/2.jpeg', caption: '', date: '', contributor: '' },
  { id: 'three', src: '/images/memories/3.jpeg', caption: '', date: '', contributor: '' },
];

/** Split the photo list into `count` roughly equal strips. */
function splitPhotos(count: number): MemoryPhoto[][] {
  const strips: MemoryPhoto[][] = Array.from({ length: count }, () => []);
  allPhotos.forEach((photo, i) => {
    strips[i % count].push(photo);
  });
  return strips;
}

/** Photos woven between the story sections. */
const photoStrips = splitPhotos(4);

export const birthdayConfig = {
  recipient: {
    name: RECIPIENT,
    displayName: RECIPIENT,
  },

  birthday: {
    dateLabel: 'October 19, 2005',
    dateISO: '2005-10-19',
  },

  landing: {
    kicker: 'Oru special person pirandha naal today.',
    title: 'THREE OF US',
    tagline: 'Three friends. A thousand memories. One unforgettable birthday.',
    revealLine: 'Moonji, naanga moonu per secret vachirukkom — unakkaga, Sam.',
    beginLabel: 'Start pannuvom, vaanga!',
    scrollHint: 'Konjam slow-a scroll pannu',
  },

  music: {
    src: '',
    label: 'Music on',
  },

  friends: FRIEND_NAMES,

  /** Four small photo strips, used between sections. */
  photoStrips,

  /** The one place all the photos sit together, if you ever want it back. */
  memories: allPhotos,

  voiceWishes: FRIEND_NAMES.map((name, i) => ({
    id: `wish-${i + 1}`,
    friendName: name,
    src: '',
    avatarSrc: '',
    intro: '',
    transcript: '',
  })) as VoiceWish[],

  quiz: {
    title: 'The friendship challenge',
    intro: 'Six questions. Answer honest-a — mela Moon irukku, athu ellam paakudhu.',
    questions: [
      {
        id: 'q1',
        question: 'Yaar ellam late-a varuvaanga?',
        options: FRIEND_NAMES,
        correctIndex: 0,
        feedback: '7 PM-nu plan panna ellame ithu dhaan. Proven.',
      },
      {
        id: 'q2',
        question: 'Biggest troublemaker yaaru?',
        options: FRIEND_NAMES,
        correctIndex: 1,
        feedback: 'Group chat la proof irukku. Romba proof irukku.',
      },
      {
        id: 'q3',
        question: 'Phone illama yaar uzhaaraalam nalla iruppaanga?',
        options: FRIEND_NAMES,
        correctIndex: 2,
        feedback: 'Santoshama irukkanga. Namma ku puriyala.',
      },
      {
        id: 'q4',
        question: 'Last-a etho emotional aana thing la yaar kaiyinaaru modhalla?',
        options: FRIEND_NAMES,
        correctIndex: 1,
        feedback: 'Deny pannunga, screenshots ready-a irukku.',
      },
      {
        id: 'q5',
        question: 'Group photo ku yaar plan pannuvaanga?',
        options: FRIEND_NAMES,
        correctIndex: 0,
        feedback: 'Kurach 12 takes minimum. Worth it thaan.',
      },
      {
        id: 'q6',
        question: 'Namma moonu per innum friends-a irukkrom nu yaar karanam?',
        options: ['Moonu perum', 'Definitely moonu perum', 'Aama, moonu perum dhaan'],
        correctIndex: 2,
        feedback: 'Trick question. Oru per dhaan nu answer varave illai.',
      },
    ] as QuizQuestion[],
  },

  moon: {
    heading: 'Ulagathula etho oru idathula, indha Moon unnoda beginning-a paathuthu irundhudhu.',
    supportingText: 'October 19, 2005 — unnoda kathai start aana naal.',
    dateLabel: 'October 19, 2005',
    phase: 'Waning Gibbous',
    illumination: 'about 95%',
    explanation:
      'A waning gibbous Moon is the almost-full disc that lingers for a few nights after the full Moon — still bright and round, but a little thinner each night, with the darkness creeping in from one edge.',
    message:
      'Ulagathula irukka ella naallayum, unnoda naal vanthu irundhudhu. Moon aaga ve irundhudhu — summa silently pannikutu irundhudhu. Aana athula namma ulaga konjam interesting aayiduchu, nee irundhadhala.',
    buttonLabel: 'Unnoda Moon-a paakalam',
    imageSrc: '/images/moon/MoonVenusMars_espenak_full.jpg',
    credit:
      'Lunar image by Fred Espenak (NASA/GSFC). Phase shown is an approximation of the waning gibbous Moon around October 2005.',
  },

  letter: {
    sealLabel: 'Sealed letter — thiranthu paaru',
    greeting: 'Hey Sam,',
    intro:
      'Naanga weeks-a dhaan idha plan pannitom. Ezhuthuradhhu exams-ai vida kammi tension-a irundhudhu. So idhu honest version.',
    paragraphs: FRIEND_NAMES.map((name) => ({
      id: `letter-${name.toLowerCase().replace(/\s+/g, '-')}`,
      author: name,
      text: `This is ${name}'s paragraph. Replace it in birthdayConfig.ts with something real — a memory, an inside joke, a small thing you have never actually said out loud. Short is fine. Honest is better.`,
    })),
    closing:
      'Happy birthday da. Eppadi ponalum, phone-a pick panna rendu per ready-a iruppodhu nu nenaichuuko.',
    signatures: FRIEND_NAMES,
  },

  gift: {
    preTitle: 'Ella memory-yum unlock pannita. Innum oru surprise waiting.',
    openLabel: 'Final surprise-a thiranthu paaru',
    title: '',
    revealMessage: '',
    imageSrc: '',
    videoSrc: '',
    clue: '',
    finalInstruction: '',
    finalMessage:
      'Happy birthday da Sam. Indha website than small part. Real thing velila irukku.',
    signatories: FRIEND_NAMES,
    placeholderNote:
      'Development placeholder — add your real gift details in birthdayConfig.ts (gift.title, gift.clue, …) before the big day.',
    replayLabel: 'Scroll back to the top',

    /* The "konjam mele paar" moment — look a little higher. */
    teaseLine: 'Konjam mele paar…',
    teaseSub: 'Innum konjam mele. Seri va, mela paaru.',
    punchTitle: 'HAPPY BIRTHDAY, SAM!',
    punchLine:
      'Happy birthday-nu solla dhaan indha website-ae pannom. Moonu per, oru website, zero chill. Namma sorry-la.',
    asideLine:
      'Aana — real gift indha box-la illa. Indha box just show-off.',
  },
};

export default birthdayConfig;
