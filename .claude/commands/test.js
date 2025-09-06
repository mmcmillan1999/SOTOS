#!/usr/bin/env node
/**
 * Custom slash command: /test
 * Runs project tests with proper error handling
 */

module.exports = {
  name: 'test',
  description: 'Run project tests',
  execute: async (args) => {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    try {
      // Detect test runner
      const fs = require('fs');
      let testCommand = 'npm test';
      
      if (fs.existsSync('package.json')) {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        if (pkg.scripts && pkg.scripts.test) {
          testCommand = 'npm test';
        }
      } else if (fs.existsSync('pytest.ini') || fs.existsSync('pyproject.toml')) {
        testCommand = 'pytest';
      } else if (fs.existsSync('Cargo.toml')) {
        testCommand = 'cargo test';
      }
      
      console.log(`Running: ${testCommand}`);
      const { stdout, stderr } = await execAsync(testCommand);
      
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
      
      return '✅ Tests completed';
    } catch (error) {
      console.error('Test failed:', error.message);
      return `❌ Tests failed: ${error.message}`;
    }
  }
};