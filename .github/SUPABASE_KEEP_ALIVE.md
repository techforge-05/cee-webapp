# Supabase Keep-Alive with GitHub Actions

## The Problem

Supabase **pauses free-tier projects** after **7 days of inactivity**. Once paused, you have to manually restart the project from the Supabase dashboard, which can take a few minutes and causes downtime.

## The Solution

A GitHub Actions workflow that runs once per day and makes a simple database query. This counts as activity and prevents Supabase from pausing the project.

The workflow lives at `.github/workflows/keep-supabase-alive.yml`.

### What it does

1. Runs automatically every day at 8 AM UTC via a cron schedule
2. Sends a lightweight REST API request to your Supabase database (`SELECT id FROM user_profiles LIMIT 1`)
3. Logs whether the ping succeeded or failed
4. Can also be triggered manually from the GitHub Actions tab

---

## How to Set It Up in a New Project

### Step 1: Create the workflow file

Create the file `.github/workflows/keep-supabase-alive.yml` in your repository:

```yaml
name: Keep Supabase Alive

on:
  schedule:
    - cron: '0 8 * * *' # Runs daily at 8 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  ping-database:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase Database
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" \
            "${{ secrets.SUPABASE_URL }}/rest/v1/YOUR_TABLE?select=id&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_KEY }}")

          if [ "$response" -eq 200 ]; then
            echo "Supabase ping successful (HTTP $response)"
          else
            echo "Supabase ping failed (HTTP $response)"
            exit 1
          fi
```

> **Important**: Replace `YOUR_TABLE` with any table in your project that has public read access (RLS `SELECT` enabled for `anon`). If no table allows public reads, use your service role key instead of the anon key.

### Step 2: Add repository secrets in GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret** and add:

| Secret Name     | Value                                          |
| --------------- | ---------------------------------------------- |
| `SUPABASE_URL`  | Your Supabase project URL (e.g. `https://xxxx.supabase.co`) |
| `SUPABASE_KEY`  | Your Supabase anon (public) key                |

You can find both values in: **Supabase Dashboard** > **Settings** > **API**

### Step 3: Push and verify

1. Commit and push the workflow file to your `main` branch
2. Go to the **Actions** tab in your GitHub repository
3. You should see the "Keep Supabase Alive" workflow listed
4. Click on it and use **Run workflow** to test it manually
5. Verify it shows a green checkmark (successful ping)

From this point on, it will run automatically every day.

---

## Customization

### Change the schedule

Edit the cron expression in the workflow. Some examples:

| Cron Expression   | Schedule              |
| ----------------- | --------------------- |
| `0 8 * * *`       | Daily at 8 AM UTC     |
| `0 */12 * * *`    | Every 12 hours        |
| `0 8 * * 1,4`     | Monday and Thursday   |
| `0 0 */3 * *`     | Every 3 days          |

Once per day is more than enough to prevent pausing.

### Use the service role key instead

If your table doesn't allow public reads, replace `SUPABASE_KEY` with `SUPABASE_SERVICE_ROLE_KEY` in both the workflow file and the GitHub secrets. The service role key bypasses Row Level Security (RLS).

---

## Troubleshooting

| Issue | Cause | Fix |
| ----- | ----- | --- |
| HTTP 401 | Invalid or missing API key | Check that `SUPABASE_KEY` secret is correct |
| HTTP 404 | Table doesn't exist | Change `YOUR_TABLE` to an existing table name |
| HTTP 403 | RLS blocks the anon key | Either add a public SELECT policy or use the service role key |
| Workflow not running | Not on default branch | Make sure the file is pushed to `main` (or your default branch) |
