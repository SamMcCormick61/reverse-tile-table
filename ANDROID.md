# Putting Reverse Tile Table on Google Play

The Android app is the same game wrapped with [Capacitor](https://capacitorjs.com). It bundles every file (fonts and word lists too), so it works with no internet. You don't need Android Studio: GitHub builds the app for you.

App ID: `io.github.sammccormick61.reversetiletable`. **This can never change once the app is on Play**, so change it in `capacitor.config.json` and `android/app/build.gradle` before the first upload if you want a different one.

## 1. Try it on your phone

1. On GitHub, open **Actions** > **Build Android app** > **Run workflow**.
2. When it finishes (about 5 minutes), open the run and download **reverse-tile-table-debug-apk**.
3. Unzip it, copy the `.apk` to an Android phone and open it. Android will ask you to allow installs from that app (Files, Drive, etc.) once. Later test builds install over it. If Android says **App not installed**, uninstall the old copy first: test builds made before 28 October 2026 each had a different key.

Until you do step 3 below, the Google Play bundle step is skipped (the run stays green) and only the debug APK is made.

## 2. Make a Google Play developer account

1. Go to [play.google.com/console](https://play.google.com/console) and sign up as a **personal** account (an organisation account needs a D-U-N-S number).
2. Pay the one-off **US$25** fee.
3. Verify your identity (photo ID) and your phone number. Google also asks you to confirm you have an Android device, using the Play Console app.
4. To charge money later (paid app or in-app purchase), set up a **payments profile** under *Settings > Payments profile*: bank account and tax details. Google keeps 15% of the first US$1M a year.

## 3. Make your upload key (once)

Google re-signs the app for players (*Play App Signing*). You only need an **upload key**, which proves uploads come from you. If you ever lose it, Play support can reset it, but keep a backup anyway.

On any computer with Java (Android Studio includes it), run:

```
keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

It asks for a password and your name. Then turn the file into text:

- Mac/Linux: `base64 -i upload.jks | tr -d '\n' > upload.txt`
- Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload.jks")) > upload.txt`

On GitHub open **Settings > Secrets and variables > Actions > New repository secret** and add four secrets:

| Name | Value |
|---|---|
| `UPLOAD_KEYSTORE_BASE64` | everything in `upload.txt` |
| `UPLOAD_KEYSTORE_PASSWORD` | the password you chose |
| `UPLOAD_KEY_ALIAS` | `upload` |
| `UPLOAD_KEY_PASSWORD` | the same password |

Never commit `upload.jks` to the repo.

## 4. Build the file for Play

**Actions > Build Android app > Run workflow**, type the version (e.g. `1.0`), and download **reverse-tile-table-play-bundle** when it's done. Inside is the `.aab` you upload to Play. Every run gets a higher internal version number automatically, which Play requires.

## 5. Create the app in Play Console

*Create app*: name **Reverse Tile Table**, language English (United Kingdom), **Game**, and **Free** or **Paid**.

> **Free or paid is a one-way door.** A paid app can later be made free, but a free app can never become paid. To earn from a free app you add in-app purchases or ads later instead.

## 6. Store listing

Everything here is already in the repo:

- **App icon** (512×512): `assets/store-icon-512.png`
- **Feature graphic** (1024×500): `assets/feature-graphic.png`
- **Phone screenshots** (at least 2): `assets/screenshots/`. Real ones from your phone will look better.
- **Category**: Word. **Tags**: Word, Puzzle.
- **Contact email**: one you're happy to show publicly.
- **Privacy policy**: `https://sammccormick61.github.io/reverse-tile-table/privacy.html` (needs GitHub Pages switched on: *Settings > Pages > Deploy from branch: main, / (root)*).

**Short description** (80 characters max):

> A finished word game, every tile face down. Can you put the letters back?

**Full description**:

> The game is over. All 100 tiles are on the board, but every one of them is face down.
>
> Draw seven letters and put each one back where you think it was played. Get it right and the tile flips face up and scores. Get it wrong and it costs you. The more you get right in one turn, the bigger the multiplier, and finishing a whole word scores the whole word, bonus squares and all.
>
> • A brand-new finished board every game, or today's board that everyone shares
> • Everyday words for a relaxed game, or the full word list for a real challenge
> • Play solo, or pass the phone round for 2 to 4 players
> • Optional turn timer and game clock
> • Helpers when you're stuck: show the opening word, show first letters, peek at a tile
> • Hot streaks and clean sweeps for big scores
> • Works offline. No ads, no accounts, no tracking.

Don't use "Scrabble" (or "Words With Friends") anywhere in the listing, keywords or screenshots. Both are trademarks, and Play removes apps that use other games' names.

## 7. App content (the *Policy* section)

- **Privacy policy**: the link above.
- **Ads**: No.
- **App access**: All functionality is available without special access.
- **Content rating**: fill in the questionnaire. Category *Game*; answer No to violence, gambling, user interaction and so on. It should come out as Everyone / PEGI 3.
- **Target audience**: 13 and over. (Choosing under-13 brings in the stricter Families rules.)
- **Data safety**: *Does your app collect or share any of the required user data types?* **No.** Data encrypted in transit: not applicable. Account deletion: not applicable.
- **Government app / financial features / health**: No.

## 8. Closed test: 12 testers for 14 days

New personal accounts must run a closed test before the app can go public.

1. *Testing > Closed testing > Create track*. Upload the `.aab` and roll it out.
2. Under *Testers*, add an email list (or a Google Group) of **at least 12 people** with Android phones and Google accounts.
3. Send them the *Join on Android* link. Each one must opt in and install the app.
4. They need to stay opted in for **14 days in a row**. Ask them to play a few times and send feedback; Google asks about this afterwards.
5. After 14 days, go to *Dashboard > Apply for production* and answer the questions about your test.

## 9. Go live

Once production access is approved (usually within a week): *Production > Create new release*, upload the latest `.aab`, add release notes, and roll out. The first review usually takes a few days.

## Updating the app

Change the game as usual, run the workflow with a new version (e.g. `1.1`), and upload the new `.aab` to a new release in Play Console.

## Keeping clear of Scrabble's IP

Game rules can't be owned, but names, artwork and some data can. This game:

- never uses the Scrabble name or logo
- uses its own bonus-square layout, its own tile counts and letter values, and calls seven-in-a-turn a "clean sweep"
- uses the public-domain ENABLE word list instead of the licensed tournament lists (TWL, Collins)
- has its own look: walnut table, green board, its own icon

Keep it that way when adding features: no Scrabble board layout, no official word lists, no Scrabble-branded wording in the store.

## For developers

```
npm ci
npm run sync           # copies the game into www/ (fonts bundled) and into the Android project
npm run assets         # regenerates icons and splash screens from assets/
node scripts/make-art.js   # redraws the icon, splash and store art
```

Open `android/` in Android Studio to run it on an emulator.
