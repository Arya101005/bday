# THREE OF US — Birthday Surprise 🌙

A single-page, scroll-through birthday surprise for **Sam**, made by three friends
(Arya, Gaytri, Harini). Built with React + Vite + TypeScript + Framer Motion.
No backend, no database, no login — it is a static site.

The copy is deliberately in **Thanglish** (Tamil written in English) — human,
friendly and a little funny, the way the three of you actually talk.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

Node 18+ is required.

## How it is laid out

One long scroll. Seven sections, with your photos woven in **between** them as
small tilted strips rather than one big gallery:

1. Entrance — “Oru special person pirandha naal today.”
2. Photo strip
3. Un moonju
4. Photo strip
5. Moonu voice, moonu wishes
6. Photo strip
7. Namma friendship test (quiz)
8. Photo strip
9. Unnoda birthday Moon
10. Moonu per irundhu oru letter
11. Final gift reveal — “Konjam mele paar…”

(Seven story sections, four photo strips between them — twelve photos in total.)

Everything is controlled from **one file**: `src/data/birthdayConfig.ts`.
You do not need to touch any component to change the text.

---

## Where to put your files

All personal assets live under `public/`. Drop files in and reference them by
path starting with `/images/...`, `/audio/...`, `/video/...`.

```
public/
  images/
    memories/    <- your photos. Any name works: mem-1.png, 2.jpeg, selfie.jpg
    moon/        <- MoonVenusMars_espenak_full.jpg is already here
    gift/        <- optional gift photo
  audio/
    wishes/      <- three voice notes (the three WhatsApp .ogg files are here)
    music/       <- optional background music
  video/         <- optional gift video
```

### Adding or removing photos

Photos are listed in `src/data/birthdayConfig.ts` under `allPhotos`. Each entry
is just an id and a src:

```ts
{ id: 'mem-1', src: '/images/memories/mem-1.png', caption: '', date: '', contributor: '' },
```

- To add a photo: put the file in `public/images/memories/` and add one line.
- To remove a photo: delete its line.
- They are automatically split into strips between sections — no other change
  needed.
- `caption`, `date` and `contributor` are **intentionally left empty**. The
  photos are random and anonymous on purpose: no names pinned to anyone, and the
  strips are not clickable, so there is no lightbox to label.
- Images use `object-fit: contain`, so nothing gets cropped or cut off, whatever
  shape the photo is.

### Voice notes (Chapter: Moonu voice, moonu wishes)

In `birthdayConfig.ts` → `voiceWishes`, set `src` for each friend:

```ts
{ id: 'wish-1', friendName: 'Arya', src: '/audio/wishes/WhatsApp Ptt 2026-10-18 at 21.05.03.ogg', avatarSrc: '', intro: '…', transcript: '' },
```

All three notes are already wired: Arya `21.05.03.ogg`, Gaytri `22.11.40.ogg`,
Harini `20.50.59.ogg`. Drop a new file in `public/audio/wishes/` and point the
matching friend's `src` at it.

- Only one voice note plays at a time — starting one pauses the others.
- If the file is missing, the player shows an empty state instead of breaking.
- `intro` is a short message under the name; `transcript` is optional captions.
- `avatarSrc` is an optional photo, e.g. `/images/friends/arya.jpg`.

### The gift (Final reveal)

In `birthdayConfig.ts` → `gift`, the reveal is a three-beat joke:

1. A gift box you tap.
2. “Konjam mele paar…” — it looks up, teases you.
3. “HAPPY BIRTHDAY, SAM!” with confetti.

Edit these fields to make it yours: `title`, `revealMessage`, `clue` (where the
real gift is hiding), `imageSrc`, `videoSrc`, `finalMessage`, and the tease
lines (`teaseLine`, `teaseSub`, `punchTitle`, `punchLine`, `asideLine`).

While `title` and `revealMessage` are empty, a development placeholder is shown
instead of a fake gift.

### Background music

In `birthdayConfig.ts` → `music`, set `src` to a file in `public/audio/music/`.
A small sound toggle appears on the entrance. It never autoplays before a click,
and it always yields to the voice notes.

---

## The Moon

Sam was born on **19 October 2005**. The Moon that night was a **Waning Gibbous**,
roughly **95% illuminated** — verified against published October 2005 lunar
calendars.

The image is a real lunar photograph by **Fred Espenak (NASA/GSFC)**, already
bundled at `public/images/moon/MoonVenusMars_espenak_full.jpg`, with credit
shown in the section. To swap in a different image, change `moon.imageSrc`.

---

## Deploy to Vercel

1. The repo is already connected — pushing is just:
   ```bash
   git add .
   git commit -m "Update content"
   git push        # pushes the bday-main branch to main + master
   ```
   (Remote: `https://github.com/Arya101005/bday.git`, which contains only this
   project — no portfolio history.)
2. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import the
   `Arya101005/bday` repo.
3. Vercel detects Vite automatically, and [`.vercel.json`](.vercel.json) pins
   build command `npm run build` and output directory `dist`. **No environment
   variables needed.**
4. Deploy. You get a URL like `bday-xxx.vercel.app`.

### After you replace photos or audio

Just commit and push again — Vercel redeploys on every push to `main`:

```bash
git add public/images/memories src/data/birthdayConfig.ts
git commit -m "Add more photos"
git push
```

Keep files reasonably small (a few MB each is fine). Very large videos are
better kept outside the repo or compressed first.

---

## Privacy — read this before sharing

- There is **no analytics, no tracking, no cookies**.
- There is **no login and no password**. Anyone who has the URL can open the
  site and see the photos, voice notes and gift details on it.
- This is a public URL on the internet, **not a private folder**. A birthday
  link passed around in a group chat is usually fine; a link pasted publicly is
  not.
- If you genuinely need it locked down, that needs real server-side access
  control (for example Vercel's password protection on a paid plan, or a service
  like Cloudflare Access). A password typed into the page is only decoration —
  it does not actually protect anything.

---

## Manual test checklist

- [x] `npm run build` succeeds with no TypeScript errors.
- [x] Entrance renders and “Start pannuvom, vaanga!” scrolls to the archive.
- [x] 12 photos load across 4 strips, nothing cropped, 0 broken images.
- [x] No horizontal overflow at 390px (mobile) or on desktop.
- [x] All three voice players wired to real WhatsApp `.ogg` notes (Arya,
      Gaytri, Harini); a missing file falls back to an empty state.
- [x] Quiz answers, scores and replay work.
- [x] Moon reveal shows the Espenak image with date, phase and illumination.
- [x] Letter envelope opens and the text types out.
- [x] Gift reveal plays the “Konjam mele paar” tease then the birthday punch,
      with confetti and sign-off from all three names.
- [x] “Scroll back to the top” returns to the start.
- [x] No console errors.
