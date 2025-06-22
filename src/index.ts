import { LangGPTServer } from './server/langgpt-server.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    
    console.log('🚀 Starting LangGPT Prompt Assistant...');
    console.log('📚 Based on the LangGPT framework for structured prompt design');
    console.log('🔗 Learn more: https://github.com/langgptai/LangGPT');
    
    const server = new LangGPTServer();
    await server.start(port);
    
    console.log(`✅ Server started successfully on port ${port}`);
    console.log('📖 Available tools:');
    console.log('   - generate_langgpt_prompt: Generate structured LangGPT prompts');
    console.log('   - analyze_prompt: Analyze and improve existing prompts');
    console.log('   - optimize_prompt: Optimize prompts based on goals');
    console.log('   - get_predefined_roles: List available predefined roles');
    console.log('');
    console.log('📝 Available prompts:');
    console.log('   - quick_role_generator: Generate basic roles quickly');
    console.log('   - prompt_analyzer: Analyze and improve prompts');
    console.log('   - role_customizer: Customize predefined roles');
    console.log('');
    console.log('🎯 Ready to help you create high-quality, structured prompts!');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down LangGPT Prompt Assistant...');
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down LangGPT Prompt Assistant...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Run the server
main().catch(console.error); 