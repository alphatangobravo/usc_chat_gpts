# USC — Top Utilized GPTs (GitHub Pages)

A Vite + React app that renders the University of South Carolina Top 10 GPTs leaderboard using official brand colors.

## Quick Start (local)
```bash
npm i
npm run dev
```

## Data
The app reads `src/data/top10.json`. Update that file to change the leaderboard.
- The build filters to exclude GPTs with ≤ 2 unique users (threshold set to 3 in `USCBrandTop10.jsx`).
- Schema:
  ```json
  [
    {
      "gpt_name": "Cocky Scholar",
      "gpt_url": "https://...",
      "messages_workspace": 3483,
      "unique_messagers_workspace": 104,
      "messages_per_user": 33.49
    }
  ]
  ```

## Deploy to GitHub Pages
1. Create a new GitHub repo (e.g., `usc-top10-gpts`).
2. Push this project to the repo's `main` branch.
3. In GitHub, go to **Settings → Pages** and ensure source is **GitHub Actions**.
4. The included workflow `.github/workflows/deploy.yml` will build on every push to `main` and deploy to Pages.
5. Your site will be available at: `https://<username>.github.io/<repo-name>/`.

### Notes on asset paths
The Vite config reads `VITE_BASE_PATH` from the workflow and sets Vite's `base` accordingly (e.g., `/repo-name/`), so paths resolve correctly on Pages.

## Customize
- Adjust the unique user threshold (`MIN_UNIQUE_USERS`) in `src/USCBrandTop10.jsx`.
- Edit brand colors in the `brand` object.
- To change fonts to USC-licensed ones, load them in `index.html` or a custom CSS and update inline styles.
