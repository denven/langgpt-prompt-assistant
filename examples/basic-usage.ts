/// <reference types="node" />

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

/**
 * Basic usage example for the LangGPT Prompt Assistant
 * This example demonstrates how to connect to the server and use its tools
 */

async function basicUsageExample() {
  console.log('🚀 LangGPT Prompt Assistant - Basic Usage Example\n');

  // Create client and connect to the server
  const client = new Client({
    name: 'langgpt-example-client',
    version: '1.0.0'
  });

  const transport = new StreamableHTTPClientTransport(
    new URL('http://localhost:3000')
  );

  try {
    await client.connect(transport);
    console.log('✅ Connected to LangGPT Prompt Assistant server\n');

    // Example 1: Generate a Programming Assistant prompt
    console.log('📝 Example 1: Generating a Programming Assistant prompt...');
    const programmingPrompt = await client.callTool({
      name: 'generate_langgpt_prompt',
      arguments: {
        role_type: 'assistant',
        domain: 'programming',
        specific_task: 'help with Python development and debugging',
        expertise_level: 'expert',
        style: 'professional and educational',
        examples: true,
        requirements: [
          'Provide clear code examples',
          'Explain best practices',
          'Include error handling suggestions'
        ],
        constraints: [
          'Always prioritize code security',
          'Provide explanations for complex concepts'
        ]
      }
    });

    console.log('Generated Programming Assistant Prompt:');
    console.log((programmingPrompt.content as any[])[0].text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 2: Analyze an existing prompt
    console.log('🔍 Example 2: Analyzing an existing prompt...');
    const analysisResult = await client.callTool({
      name: 'analyze_prompt',
      arguments: {
        prompt: 'You are a helpful assistant. Please help me with my questions.',
        analysis_type: 'effectiveness',
        target_audience: 'general users',
        use_case: 'customer support'
      }
    });

    console.log('Prompt Analysis Results:');
    console.log((analysisResult.content as any[])[0].text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 3: Optimize a prompt
    console.log('⚡ Example 3: Optimizing a prompt...');
    const optimizationResult = await client.callTool({
      name: 'optimize_prompt',
      arguments: {
        original_prompt: 'You are a helpful assistant. Please help me with my questions.',
        optimization_goals: ['clarity', 'structure', 'effectiveness'],
        target_length: 150,
        style_preferences: {
          formal: true,
          professional: true
        }
      }
    });

    console.log('Prompt Optimization Results:');
    console.log((optimizationResult.content as any[])[0].text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 4: Get predefined roles
    console.log('📋 Example 4: Getting predefined roles...');
    const rolesResult = await client.callTool({
      name: 'get_predefined_roles',
      arguments: {
        category: 'programming'
      }
    });

    console.log('Available Programming Roles:');
    console.log((rolesResult.content as any[])[0].text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Example 5: Use a prompt template
    console.log('🎯 Example 5: Using a prompt template...');
    const promptResult = await client.getPrompt({
      name: 'quick_role_generator',
      arguments: {
        role_name: 'Data Scientist',
        main_task: 'analyze datasets and provide insights',
        expertise_level: 'advanced'
      }
    });

    console.log('Generated Role Template:');
    promptResult.messages.forEach((msg, index) => {
      console.log(`Message ${index + 1} (${msg.role}):`);
      console.log(msg.content.text);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from server');
  }
}

/**
 * Advanced usage example with multiple tools
 */
async function advancedUsageExample() {
  console.log('🚀 LangGPT Prompt Assistant - Advanced Usage Example\n');

  const client = new Client({
    name: 'langgpt-advanced-client',
    version: '1.0.0'
  });

  const transport = new StreamableHTTPClientTransport(
    new URL('http://localhost:3000')
  );

  try {
    await client.connect(transport);
    console.log('✅ Connected to LangGPT Prompt Assistant server\n');

    // Step 1: Generate a custom role
    console.log('📝 Step 1: Generating a custom Writing Assistant role...');
    const writingPrompt = await client.callTool({
      name: 'generate_langgpt_prompt',
      arguments: {
        role_type: 'assistant',
        domain: 'writing',
        specific_task: 'help with academic writing and research papers',
        expertise_level: 'expert',
        style: 'academic and formal',
        output_format: 'structured_response',
        examples: true,
        requirements: [
          'Follow academic writing standards',
          'Provide citation suggestions',
          'Help with structure and flow'
        ]
      }
    });

    const generatedPrompt = (writingPrompt.content as any[])[0].text;
    console.log('Generated Writing Assistant Prompt:');
    console.log(generatedPrompt);
    console.log('\n' + '='.repeat(80) + '\n');

    // Step 2: Analyze the generated prompt
    console.log('🔍 Step 2: Analyzing the generated prompt...');
    const analysis = await client.callTool({
      name: 'analyze_prompt',
      arguments: {
        prompt: generatedPrompt,
        analysis_type: 'completeness',
        target_audience: 'academic researchers',
        use_case: 'research paper writing'
      }
    });

    console.log('Analysis Results:');
    console.log((analysis.content as any[])[0].text);
    console.log('\n' + '='.repeat(80) + '\n');

    // Step 3: Optimize the prompt based on analysis
    console.log('⚡ Step 3: Optimizing the prompt...');
    const optimization = await client.callTool({
      name: 'optimize_prompt',
      arguments: {
        original_prompt: generatedPrompt,
        optimization_goals: ['clarity', 'completeness'],
        constraints: [
          'Maintain academic tone',
          'Keep role definition clear'
        ],
        target_length: 300
      }
    });

    console.log('Optimization Results:');
    console.log((optimization.content as any[])[0].text);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from server');
  }
}

/**
 * Example of using the role customizer prompt
 */
async function roleCustomizerExample() {
  console.log('🚀 LangGPT Prompt Assistant - Role Customizer Example\n');

  const client = new Client({
    name: 'langgpt-customizer-client',
    version: '1.0.0'
  });

  const transport = new StreamableHTTPClientTransport(
    new URL('http://localhost:3000')
  );

  try {
    await client.connect(transport);
    console.log('✅ Connected to LangGPT Prompt Assistant server\n');

    // Customize the programming assistant for web development
    console.log('🎨 Customizing Programming Assistant for Web Development...');
    const customRole = await client.getPrompt({
      name: 'role_customizer',
      arguments: {
        base_role: 'programming_assistant',
        custom_domain: 'web development',
        additional_skills: 'React, Node.js, API development, responsive design',
        specific_constraints: 'Focus on modern web technologies, prioritize user experience'
      }
    });

    console.log('Customized Role:');
    customRole.messages.forEach((msg, index) => {
      console.log(`Message ${index + 1} (${msg.role}):`);
      console.log(msg.content.text);
      console.log();
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('👋 Disconnected from server');
  }
}

// Run examples
async function runExamples() {
  console.log('🎯 Running LangGPT Prompt Assistant Examples\n');
  
  try {
    await basicUsageExample();
    console.log('\n' + '='.repeat(80) + '\n');
    
    await advancedUsageExample();
    console.log('\n' + '='.repeat(80) + '\n');
    
    await roleCustomizerExample();
    
    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export functions for use in other modules
export {
  basicUsageExample,
  advancedUsageExample,
  roleCustomizerExample,
  runExamples
};

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
} 