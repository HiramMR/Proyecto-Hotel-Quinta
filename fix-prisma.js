const fs = require('fs');
const path = require('path');

// We need to remove these files to stop Prisma 7 from using the new config mode
// Checking current folder, prisma folder, and parent folder
const filesToRemove = [
  path.join(__dirname, 'prisma.config.ts'),
  path.join(__dirname, 'prisma', 'prisma.config.ts'),
  path.join(__dirname, '..', 'prisma.config.ts'),
  path.join(__dirname, 'prisma.config.js'), // Delete the failing JS config
  path.join(__dirname, 'prisma.config.mjs'), // Delete the failing MJS config
  path.join(__dirname, 'app', 'lib', 'prisma.config.ts'), // Found this in your file list
];

console.log("Cleaning up Prisma configuration...");

filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log(`✅ Deleted: ${file}`);
    } catch (e) {
      console.error(`❌ Error deleting ${file}:`, e.message);
    }
  } else {
    console.log(`Checked (not found): ${file}`);
  }
});
console.log("Cleanup complete. Now run 'npx prisma generate'");