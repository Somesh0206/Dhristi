import git from 'isomorphic-git';
import fs from 'fs';
import path from 'path';

async function commitAll() {
  const dir = '.';

  console.log('Reading status...');
  const statusMatrix = await git.statusMatrix({ fs, dir });
  console.log(`Found ${statusMatrix.length} files in git status.`);

  for (const [filepath, head, workdir, stage] of statusMatrix) {
    if (filepath.startsWith('node_modules/') || filepath.startsWith('.next/')) continue;

    if (workdir === 0) {
      // File deleted in working directory
      await git.remove({ fs, dir, filepath });
      console.log(`- Removed from git: ${filepath}`);
    } else {
      // File modified or added
      await git.add({ fs, dir, filepath });
      console.log(`+ Staged in git: ${filepath}`);
    }
  }

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'Somesh0206',
      email: 'somesh@dhristi.ai',
    },
    message: 'feat: Complete migration from TypeScript to pure JavaScript/Python architecture and verify production build',
  });

  console.log(`\n🎉 Successfully committed changes! New commit SHA: ${sha}`);
}

commitAll().catch(err => {
  console.error('Error during git commit:', err);
});
