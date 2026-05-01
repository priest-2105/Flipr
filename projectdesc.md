eah, that’s very possible—and actually a pretty solid project idea. What you’re describing is basically a flipbook-style video generator: take media → break it into frames → optionally simplify/transform → export as a low-FPS animation.

The tricky part isn’t whether it’s possible, it’s doing it efficiently (video processing can get heavy fast).

What you’re really building

At a high level:

Input
Video upload OR multiple images
Processing
Extract frames (from video)
Control frame rate (e.g., 5 FPS for that “flipbook” feel)
Optionally stylize frames (sketch effect, reduced colors, etc.)
Output
Recompile into video/GIF
Export at chosen FPS
Tech stack (realistic choice for you)

Since you already use Next.js, don’t abandon that. Just don’t try to do heavy video processing in the frontend.

Frontend
Next.js (React)
For upload UI, preview, controls (FPS slider, effects)
Backend (this is the important part)

You have 3 solid options:

Option 1 — Best balance (Recommended)
Node.js + FFmpeg
Use something like:
fluent-ffmpeg (wrapper)
or call FFmpeg directly

👉 Why: