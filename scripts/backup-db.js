import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

/**
 * TIERED BACKUP ROTATION POLICY:
 * 1. Hourly: Keep every backup taken in the last 24 hours.
 * 2. Daily: Keep one backup (the first one of the day) for days 1-14.
 * 3. Prune: Delete everything else.
 */

// Configuration - Adjusted per project
const DB_NAME = 'gigaflair-db'; // Note: Assuming standard naming, check if gigaflair uses D1
const PROJECT_NAME = 'gigaflair';
const BACKUP_DIR = `/Users/matthewfowler/Documents/GitRepo/${PROJECT_NAME}.git/backups`;

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

// Ensure backup directory exists
if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
}

function runBackup() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `backup-${timestamp}.sql`;
    const outputPath = join(BACKUP_DIR, filename);

    console.log(`[${now.toISOString()}] Starting backup for ${DB_NAME}...`);

    try {
        // Check if D1 is actually configured before trying to export
        // For GigaFlair, let's verify if D1 is used first
        execSync(`npx wrangler d1 export ${DB_NAME} --remote --output ${outputPath}`, { stdio: 'inherit' });
        console.log(`Backup completed: ${outputPath}`);
        rotateBackups();
    } catch (error) {
        console.error('Backup failed:', error.message);
        // If D1 doesn't exist yet, we don't want to crash everything
        if (error.message.includes('not found')) {
            console.log('Skipping backup: D1 database not found for this project.');
        } else {
            process.exit(1);
        }
    }
}

function rotateBackups() {
    console.log('Running tiered rotation policy...');
    const files = readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql'));
    const now = Date.now();

    // Group files by day for the daily retention check
    const dailyGroups = new Map();

    files.forEach(file => {
        const filePath = join(BACKUP_DIR, file);
        const stats = statSync(filePath);
        const ageMs = now - stats.mtimeMs;

        // 1. Hourly Retention (Last 24 Hours)
        if (ageMs <= MS_PER_DAY) {
            // Keep everything in the last 24 hours
            return;
        }

        // 2. Daily Retention (Days 1 to 14)
        if (ageMs > MS_PER_DAY && ageMs <= 14 * MS_PER_DAY) {
            const dayKey = new Date(stats.mtimeMs).toISOString().split('T')[0];
            if (!dailyGroups.has(dayKey)) {
                dailyGroups.set(dayKey, []);
            }
            dailyGroups.get(dayKey).push({ file, mtime: stats.mtimeMs });
            return;
        }

        // 3. Beyond 14 days -> Mark for deletion
        console.log(`Deleting expired backup (>14 days): ${file}`);
        unlinkSync(filePath);
    });

    // For each day in the 1-14 day range, keep only the OLDEST (first) backup of that day
    dailyGroups.forEach((backups, day) => {
        if (backups.length > 1) {
            // Sort by mtime ascending (oldest first)
            backups.sort((a, b) => a.mtime - b.mtime);

            // Keep the first, delete the rest
            const [toKeep, ...toDelete] = backups;
            toDelete.forEach(b => {
                console.log(`Pruning redundant hourly backup from ${day}: ${b.file}`);
                unlinkSync(join(BACKUP_DIR, b.file));
            });
        }
    });

    console.log('Rotation completed.');
}

runBackup();
