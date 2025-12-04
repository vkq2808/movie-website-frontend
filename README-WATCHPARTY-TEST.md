Watch Party — Local smoke test
=================================

Quick steps to manually test host vs viewer behavior locally.

Prerequisites
- Run the frontend dev server from the `fe` folder:

```bash
cd fe
npm run dev
```

Test flow (manual)
1. Open two browser windows (or one normal + one incognito) so they do not share cookies/localStorage.
2. In one window (the host):
   - Log in as the user who is the host for the watch party, or set the `userId` in localStorage to the host's id:
     - DevTools Console:
       - `localStorage.setItem('userId', '<HOST_USER_ID>')`
       - If you have an `access_token` available, set a cookie: `document.cookie = 'access_token=<TOKEN>; path=/';`
   - Open the watch party live page: `http://localhost:3000/watch-parties/<PARTY_ID>/live`.

3. In the other window (viewer):
   - Ensure the viewer either has no `access_token` cookie or has a different `userId` in localStorage.
   - Open the same watch party live page.

What to observe
- The socket connection is initialized in both windows (check console logs for "[WatchParty] Socket connected").
- The host should be able to click Play/Pause and Seek in the custom controls; those controls are enabled only for the host.
- When the host plays, viewers should receive a `play_broadcast` and the video in their window should start and seek to the same position.
- When the host seeks or pauses, viewers should follow the host's actions.
- Viewers' controls are disabled; attempts to interact should not emit socket events.

Developer tips
- If you see stale TypeScript errors complaining about `.next/types`, remove that folder and re-run the type-check:

```bash
cd fe
rm -rf .next/types
npx tsc --noEmit --skipLibCheck
```

- The page-level wiring was split so that the socket is created inside the `WatchPartyProvider` wrapper. If you render `WatchPartyClient` standalone, it will still initialize its own socket by default. To avoid duplicate sockets when the page already creates one, `WatchPartyClient` accepts props:
  - `showPlayer?: boolean` — set to `false` if you already render the player elsewhere.
  - `initializeSocket?: boolean` — set to `false` to avoid creating a second socket instance.

Files changed
- `fe/src/app/watch-parties/[id]/live/page.tsx` — main wiring and `MainWatchPartyContent` created
- `fe/src/app/watch-parties/[id]/live/hooks/useVideoSync.tsx` — video sync hook
- `fe/src/app/watch-parties/[id]/live/components/LiveVideoControls/LiveVideoControls.tsx` — custom controls
- `fe/src/app/watch-parties/[id]/live/WatchPartyClient.tsx` — now accepts `showPlayer` and `initializeSocket` props and can wire controls

If you want, I can create an automated Playwright script to run a headless host + viewer scenario next.
