# Stumple

A Wordle-style guessing game for international cricketers.

## How to deploy this (no coding experience needed)

1. **Create a free GitHub account** at github.com if you don't have one.
2. **Create a new repository** (click the "+" in the top right → "New repository"). Name it `stumple`. Leave it public. Don't add a README (you already have one).
3. **Upload these files**: on your new repo's page, click "uploading an existing file" and drag this entire folder's contents in (keep the `src` folder structure intact — GitHub will preserve it if you drag the folder itself, or you can drag files individually into matching paths).
4. **Sign up for Vercel** at vercel.com using your GitHub account (one click, no separate password needed).
5. **Import your repo**: on Vercel's dashboard, click "Add New Project", select your `stumple` repo, and click "Deploy". Vercel automatically detects it's a Vite project and handles the build — you don't need to install anything yourself.
6. Wait about a minute. Vercel gives you a live URL (something like `stumple-yourname.vercel.app`) — that's your game, live on the internet.
7. **Optional custom domain**: buy a domain (e.g. from Namecheap), then in Vercel go to your project → Settings → Domains, and follow the instructions to point your domain at it.

That's it — no local setup, no command line required.
