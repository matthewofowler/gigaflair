# Mirroring & Backup Strategy (GigaFlair)

This repository is configured with a triple-redundancy push strategy to ensure code safety and automated security scanning.

## Configured Remotes

| Name | Destination | Purpose |
| :--- | :--- | :--- |
| `origin` | [GitHub](https://github.com/matthewofowler/gigaflair) | Primary Remote & Source of Truth |
| `gitlab` | [GitLab](https://gitlab.com/matthewofowler/gigaflair) | Redundancy & SAST/Secret Detection |
| `local` | `/Users/matthewfowler/Documents/GitRepo/gigaflair.git` | Offline Bare Repository Backup |
| `all` | Multi-Remote (GitHub, GitLab, Local) | Combined Push Destination |

## How to Sync

To synchronize all three backup locations at once, use the `all` remote:

```bash
git push all main
```

## Data Backup Strategy

In addition to code mirroring, we maintain a tiered database backup rotation in the local mirror folder.

### Rotation Policy
- **Hourly (Last 24h):** Captures every backup taken in the last 24 hours.
- **Daily (Days 1-14):** Keeps the first backup of each day for two weeks.

### How to Backup Data
Run the following command to export the current production database and prune old backups:
```bash
npm run db:backup
```

The backups are saved as `.sql` files in:
`/Users/matthewfowler/Documents/GitRepo/gigaflair.git/backups`

## Setup Details

### Local Bare Repository
The local backup is a "bare" Git repository. If needed, it can be cloned at any time:
```bash
git clone /Users/matthewfowler/Documents/GitRepo/gigaflair.git
```

### Git Configuration
The `.git/config` has been modified to include multiple `pushurl` entries for the `all` remote.
