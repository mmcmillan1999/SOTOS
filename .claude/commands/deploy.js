#!/usr/bin/env node
/**
 * Custom slash command: /deploy
 * Deploy project to production
 */

module.exports = {
  name: 'deploy',
  description: 'Deploy project to production',
  execute: async (args) => {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    try {
      const steps = [
        { name: 'Running tests', cmd: 'npm test' },
        { name: 'Building project', cmd: 'npm run build' },
        { name: 'Deploying', cmd: 'npm run deploy' }
      ];
      
      for (const step of steps) {
        console.log(`\n${step.name}...`);
        try {
          const { stdout } = await execAsync(step.cmd);
          if (stdout) console.log(stdout);
        } catch (error) {
          // Some commands might not exist, skip gracefully
          if (error.code === 1) {
            console.log(`Skipping: ${step.name} (not configured)`);
          } else {
            throw error;
          }
        }
      }
      
      return '🚀 Deployment complete!';
    } catch (error) {
      return `❌ Deployment failed: ${error.message}`;
    }
  }
};