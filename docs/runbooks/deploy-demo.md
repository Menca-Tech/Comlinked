# Deploy the demo

The shared demo is the Next.js app (the website and the simulated `/app`) on Vercel. GitHub
Actions deploys it with the Vercel CLI, using a personal Vercel token, so Vercel's own Git
integration stays off. The workflow is
[`.github/workflows/deploy-demo.yml`](../../.github/workflows/deploy-demo.yml).

- It runs on every push to the `demo` branch, and by hand from the Actions tab.
- It runs lint, the type check and the unit tests first. If any fail, nothing deploys.
- It builds with `NEXT_PUBLIC_DEMO_DEPLOYMENT=true`. Every page then shows "Demo. Companies,
  people and figures are invented." and asks search engines not to index it.
- Supabase stays unset, so the app calls no outside host.
- The HTML mockup in `docs/mockup` is never deployed.

## Set it up once

1. **Create the Vercel project.** In the repo, run `pnpm dlx vercel@65.9.0 link` and sign in
   with your own Vercel account. Choose "create a new project" and name it. Don't connect a Git
   repository. This writes `.vercel/project.json`, which is git-ignored.
2. **Copy the two IDs.** `.vercel/project.json` holds `orgId` and `projectId`.
3. **Create a token.** On vercel.com, go to Account Settings, then Tokens. Create one named
   "GitHub Actions demo deploy", scoped to your account, with an expiry date.
4. **Add three secrets in GitHub.** In the repo, go to Settings, then Secrets and variables,
   then Actions:
   - `VERCEL_TOKEN`: the token
   - `VERCEL_ORG_ID`: the `orgId`
   - `VERCEL_PROJECT_ID`: the `projectId`
5. **Set the project's environment variables in Vercel,** for Production:
   - `NEXT_PUBLIC_DEMO_DEPLOYMENT` = `true`. The workflow sets it too; this keeps a build
     started from the Vercel dashboard marked as the demo.
   - `NEXT_PUBLIC_PREVIEW_PRESENTER_EMAIL` = the presenter's address, so the Pilot Preview's
     last Stop offers its email button. Never write it into the repo.
   - Leave `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` unset.
6. **Check who can open it.** In the Vercel project, go to Settings, then Deployment
   Protection. See what your plan offers for the production address, and choose before you
   share the link.

## Publish or update the link

1. Pick a commit that has passed every check, including the browser tests on your machine.
2. Point `demo` at it and push:

   ```sh
   git branch -f demo <commit>
   git push origin demo --force-with-lease
   ```

   The first time, `git branch demo <commit>` and `git push -u origin demo`.

3. Watch the run in the repo's Actions tab. When it's green, the Vercel project shows the
   production address.
4. Open the address on a phone as a new company owner: claim, take a lead, open ComDash, then
   run the Pilot Preview from Stop 1 to Stop 6. Check the demo notice shows.

To take the demo down, remove the deployment in the Vercel project, or delete the project.

## Notes

- **Plan.** Vercel's Hobby plan is for non-commercial use. It may cover a short private demo,
  but a link a chamber relies on needs a paid plan.
- **Repository visibility.** The repository is public while this demo runs. Making it
  private later doesn't remove what was public: anyone who copied it keeps that copy.
- **Token.** Revoke it in Vercel when the demo ends, and delete the three secrets.
