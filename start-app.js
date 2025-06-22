#!/usr/bin/env node

/**
 * Startup script for LangGPT Prompt Assistant
 * Runs both the MCP backend server and frontend server
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting LangGPT Prompt Assistant...\n');

// Function to start a process
function startProcess(command, args, name, color) {
    const process = spawn(command, args, {
        stdio: 'pipe',
        shell: true,
        cwd: __dirname
    });

    process.stdout.on('data', (data) => {
        console.log(`[${color}${name}\x1b[0m] ${data.toString().trim()}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`[${color}${name}\x1b[0m] ERROR: ${data.toString().trim()}`);
    });

    process.on('close', (code) => {
        console.log(`[${color}${name}\x1b[0m] Process exited with code ${code}`);
    });

    return process;
}

// Start MCP backend server
console.log('📡 Starting MCP backend server...');
const backendProcess = startProcess('npm', ['run', 'dev'], 'BACKEND', '\x1b[36m');

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
    console.log('🌐 Starting frontend server...');
    const frontendProcess = startProcess('node', ['frontend-server.js'], 'FRONTEND', '\x1b[32m');

    // Handle shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down servers...');
        backendProcess.kill('SIGINT');
        frontendProcess.kill('SIGINT');
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 Shutting down servers...');
        backendProcess.kill('SIGTERM');
        frontendProcess.kill('SIGTERM');
        process.exit(0);
    });

}, 2000);

console.log('\n✅ Servers starting up...');
console.log('📱 Frontend will be available at: http://localhost:8080');
console.log('🔗 MCP backend will be available at: http://localhost:3000');
console.log('⏹️  Press Ctrl+C to stop all servers\n'); 