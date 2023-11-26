# Template for TypeScript Webgames

How to use:

- The first time you open this, run `npm install`
- Every time you want to work on it, run `npm run dev`
- To publish, run `npm run update` (you'll need to set up [butler](https://itch.io/docs/butler/))
    - If you don't want to set up butler, just run `npm run build`, zip up the generated `/dist/` folder, and upload it using itch's web interface

Steps I followed to create the project:

- `npm create vite@latest`, choosing `template-vanilla` as the name and vanilla typescript
- `cd template-vanilla`
- `git init`
- Remove `public`, move `index.html` into `src`, add `itchio.html`, and change the contents of `src`
- Add `vite.config.js`
- Run `npm install`
