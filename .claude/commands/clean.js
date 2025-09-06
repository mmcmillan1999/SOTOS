#!/usr/bin/env node
/**
 * Custom slash command: /clean
 * Clean build artifacts and temporary files
 */

module.exports = {
  name: 'clean',
  description: 'Clean build artifacts and temporary files',
  execute: async () => {
    const fs = require('fs');
    const path = require('path');
    
    const dirsToClean = [
      'dist',
      'build',
      'out',
      '.next',
      'coverage',
      'node_modules/.cache',
      '__pycache__',
      '.pytest_cache',
      '.mypy_cache',
      '.ruff_cache',
      'target' // Rust
    ];
    
    const filePatternsToClean = [
      '*.pyc',
      '*.pyo',
      '*.log',
      '.DS_Store',
      'Thumbs.db'
    ];
    
    let cleaned = [];
    
    // Clean directories
    for (const dir of dirsToClean) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        cleaned.push(dir);
      }
    }
    
    // Clean file patterns
    const cleanPattern = (pattern) => {
      const glob = require('glob');
      const files = glob.sync(pattern, { dot: true });
      files.forEach(file => {
        fs.unlinkSync(file);
        cleaned.push(file);
      });
    };
    
    // Note: glob package would need to be available
    // For now, just report what would be cleaned
    
    if (cleaned.length > 0) {
      console.log('Cleaned:', cleaned.join(', '));
      return `🧹 Cleaned ${cleaned.length} items`;
    } else {
      return '✨ Already clean';
    }
  }
};