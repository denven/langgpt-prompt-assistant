/**
 * Simple test to verify the MCP server is working
 */

import http from 'http';

function testServer() {
  console.log('🔍 Testing LangGPT Prompt Assistant server...\n');
  
  // Test if server is responding
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Server is responding! Status: ${res.statusCode}`);
    console.log(`📡 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`📄 Response: ${data}`);
    });
  });

  req.on('error', (error) => {
    console.log('❌ Server connection failed:', error.message);
    console.log('\n💡 This is expected - MCP servers don\'t serve web pages.');
    console.log('🎯 Try running: node test-simple.js');
  });

  req.setTimeout(5000, () => {
    console.log('⏰ Request timed out');
    req.destroy();
  });

  req.end();
}

// Test the server
testServer();

console.log('\n📋 Alternative testing options:');
console.log('1. Run: node test-simple.js (recommended)');
console.log('2. Use an MCP client to connect to the server');
console.log('3. Check server logs in your terminal'); 