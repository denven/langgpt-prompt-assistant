/**
 * Simple test script for LangGPT Prompt Assistant
 * This demonstrates the core functionality without complex MCP dependencies
 */

// Mock LangGPT templates and generator for demonstration
const mockLangGPTTemplates = {
  baseRoleTemplate: (role) => {
    return `# Role: ${role.name}

## Profile
- Description: ${role.description}

## Skills
${role.skills ? role.skills.map(skill => `- ${skill}`).join('\n') : '- Adaptable and knowledgeable'}

## Constraints
${role.constraints ? role.constraints.map(constraint => `- ${constraint}`).join('\n') : '- Always provide accurate and helpful information'}

## Instructions
${role.instructions}

${role.workflow ? `## Workflow
${role.workflow.map((step, index) => `${index + 1}. ${step}`).join('\n')}` : ''}

## Response
Please respond according to the above role definition and instructions.`;
  },

  predefinedRoles: {
    'programming_assistant': {
      name: 'Programming Assistant',
      description: 'An expert programming assistant that helps with code development, debugging, and best practices',
      instructions: `You are an expert programming assistant with deep knowledge of multiple programming languages and software development practices. Your role is to:

1. Help users write, debug, and optimize code
2. Explain programming concepts clearly and concisely
3. Suggest best practices and design patterns
4. Provide code reviews and improvement suggestions
5. Help with debugging and troubleshooting
6. Explain complex technical concepts in simple terms

Always provide clear, well-documented code examples and explain your reasoning.`,
      skills: [
        'Multiple programming languages (Python, JavaScript, TypeScript, Java, C++, etc.)',
        'Software architecture and design patterns',
        'Debugging and troubleshooting',
        'Code optimization and performance',
        'Testing and quality assurance',
        'Version control systems',
        'API development and integration'
      ],
      constraints: [
        'Always prioritize code security and best practices',
        'Provide explanations for complex concepts',
        'Include error handling in code examples',
        'Suggest testing approaches when appropriate'
      ],
      workflow: [
        'Understand the user\'s programming problem or question',
        'Analyze the requirements and constraints',
        'Provide a clear solution with code examples',
        'Explain the reasoning and best practices',
        'Suggest improvements or alternatives when applicable'
      ]
    },

    'writing_assistant': {
      name: 'Writing Assistant',
      description: 'A professional writing assistant that helps with content creation, editing, and style improvement',
      instructions: `You are a professional writing assistant with expertise in various writing styles and formats. Your role is to:

1. Help users improve their writing clarity and effectiveness
2. Provide suggestions for structure, flow, and style
3. Assist with content creation for different audiences
4. Offer editing and proofreading suggestions
5. Help with tone and voice adjustments
6. Provide writing templates and frameworks

Always maintain the user's original intent while improving clarity and impact.`,
      skills: [
        'Content writing and editing',
        'Grammar and style improvement',
        'Audience adaptation',
        'Storytelling and narrative structure',
        'Technical writing',
        'Creative writing',
        'SEO and marketing copy'
      ],
      constraints: [
        'Preserve the author\'s voice and intent',
        'Provide constructive feedback',
        'Maintain appropriate tone for the audience',
        'Respect copyright and plagiarism concerns'
      ]
    }
  }
};

// Mock prompt generator service
class MockPromptGenerator {
  generatePrompt(request) {
    console.log('🎯 Generating LangGPT prompt with parameters:', JSON.stringify(request, null, 2));
    
    // Check if we have a predefined role
    const predefinedRoleKey = this.findMatchingPredefinedRole(request);
    
    let role;
    if (predefinedRoleKey) {
      role = this.customizePredefinedRole(mockLangGPTTemplates.predefinedRoles[predefinedRoleKey], request);
    } else {
      role = this.generateCustomRole(request);
    }

    const template = mockLangGPTTemplates.baseRoleTemplate(role);
    const usageInstructions = this.generateUsageInstructions(role, request);
    const tips = this.generateTips(request);

    return {
      success: true,
      role,
      template,
      usage_instructions: usageInstructions,
      tips
    };
  }

  findMatchingPredefinedRole(request) {
    const domain = request.domain.toLowerCase();
    if (domain.includes('programming') || domain.includes('coding')) {
      return 'programming_assistant';
    }
    if (domain.includes('writing') || domain.includes('content')) {
      return 'writing_assistant';
    }
    return null;
  }

  customizePredefinedRole(baseRole, request) {
    return {
      ...baseRole,
      name: `${request.role_type.charAt(0).toUpperCase() + request.role_type.slice(1)} ${request.domain.charAt(0).toUpperCase() + request.domain.slice(1)}`,
      description: `${baseRole.description} specializing in ${request.specific_task}`,
      instructions: `${baseRole.instructions}

Specific Focus: ${request.specific_task}
${request.requirements ? `Additional Requirements: ${request.requirements.join(', ')}` : ''}
${request.style ? `Communication Style: ${request.style}` : ''}`,
      constraints: [
        ...(baseRole.constraints || []),
        ...(request.constraints || [])
      ]
    };
  }

  generateCustomRole(request) {
    return {
      name: `${request.role_type.charAt(0).toUpperCase() + request.role_type.slice(1)} ${request.domain.charAt(0).toUpperCase() + request.domain.slice(1)}`,
      description: `A ${request.expertise_level || 'expert'} ${request.role_type} in the field of ${request.domain} with focus on ${request.specific_task}`,
      instructions: `You are a ${request.expertise_level || 'expert'} ${request.role_type} in the field of ${request.domain}. Your primary responsibility is to ${request.specific_task}.

${request.requirements ? `Additional Requirements:
${request.requirements.map(req => `- ${req}`).join('\n')}` : ''}

${request.style ? `Communication Style: ${request.style}` : ''}

Please provide clear, accurate, and helpful assistance while maintaining professional standards.`,
      skills: [
        `Expert knowledge in ${request.domain}`,
        `Proficiency in ${request.specific_task}`,
        'Clear communication and explanation',
        'Problem-solving and analytical thinking'
      ],
      constraints: request.constraints || [
        'Always provide accurate and reliable information',
        'Maintain professional and helpful tone',
        'Consider user context and needs'
      ],
      workflow: [
        'Understand the user\'s question or problem',
        'Analyze the context and requirements',
        'Provide comprehensive and accurate assistance',
        'Offer additional insights or suggestions when helpful',
        'Ensure clarity and usefulness of response'
      ]
    };
  }

  generateUsageInstructions(role, request) {
    return `## Usage Instructions

1. **Copy the template above** and paste it into your AI assistant's system prompt or role definition.

2. **Customize as needed**:
   - Adjust the role name and description to match your specific needs
   - Modify skills and constraints based on your requirements
   - Add or remove workflow steps as appropriate

3. **For best results**:
   - Provide clear, specific questions or tasks
   - Include relevant context and background information
   - Specify your preferred output format if needed

4. **Example usage**:
   "I need help with ${request.specific_task} in the context of ${request.domain}. Can you assist me with [specific question]?"

5. **Iterate and improve**:
   - Test the prompt with different types of questions
   - Refine based on the responses you receive
   - Adjust the role definition as needed for better results`;
  }

  generateTips(request) {
    const tips = [
      'Start with clear, specific questions to get the best responses',
      'Provide context and background information when relevant',
      'Be explicit about your desired output format and style',
      'Use the role\'s expertise level appropriately in your questions',
      'Iterate and refine the prompt based on initial results'
    ];

    if (request.expertise_level === 'beginner') {
      tips.push('Ask for explanations of complex concepts and terminology');
      tips.push('Request step-by-step guidance for complex tasks');
    }

    if (request.expertise_level === 'expert') {
      tips.push('Feel free to ask for advanced techniques and optimizations');
      tips.push('Request detailed technical analysis and comparisons');
    }

    return tips;
  }

  analyzePrompt(request) {
    console.log('🔍 Analyzing prompt:', request.prompt);
    
    // Simple analysis logic
    const structureScore = this.analyzeStructure(request.prompt);
    const clarityScore = this.analyzeClarity(request.prompt);
    const completenessScore = this.analyzeCompleteness(request.prompt);

    const suggestions = this.generateAnalysisSuggestions(request.prompt, request.analysis_type);
    const strengths = this.identifyStrengths(request.prompt);
    const weaknesses = this.identifyWeaknesses(request.prompt);

    return {
      success: true,
      analysis: {
        structure_score: structureScore,
        clarity_score: clarityScore,
        completeness_score: completenessScore,
        suggestions,
        strengths,
        weaknesses,
        recommendations: [
          'Consider adding more specific instructions',
          'Include examples for better clarity',
          'Define clear output format expectations'
        ]
      }
    };
  }

  analyzeStructure(prompt) {
    let score = 5;
    if (prompt.includes('##') || prompt.includes('**')) score += 1;
    if (prompt.includes('1.') || prompt.includes('-')) score += 1;
    if (prompt.includes('role') || prompt.includes('assistant')) score += 1;
    if (prompt.includes('instruction') || prompt.includes('should')) score += 1;
    return Math.min(score, 10);
  }

  analyzeClarity(prompt) {
    let score = 5;
    if (prompt.includes('specific') || prompt.includes('detailed')) score += 1;
    if (prompt.includes('example')) score += 1;
    if (prompt.includes('format')) score += 1;
    if (prompt.includes('constraint')) score += 1;
    return Math.min(score, 10);
  }

  analyzeCompleteness(prompt) {
    let score = 5;
    if (prompt.includes('role')) score += 1;
    if (prompt.includes('instruction')) score += 1;
    if (prompt.includes('context')) score += 1;
    if (prompt.includes('format')) score += 1;
    return Math.min(score, 10);
  }

  generateAnalysisSuggestions(prompt, analysisType) {
    const suggestions = [];
    if (analysisType === 'structure') {
      if (!prompt.includes('##')) suggestions.push('Add clear section headers using markdown formatting');
      if (!prompt.includes('1.')) suggestions.push('Use numbered lists for step-by-step instructions');
    }
    if (analysisType === 'effectiveness') {
      if (!prompt.includes('example')) suggestions.push('Include specific examples to illustrate expectations');
      if (!prompt.includes('format')) suggestions.push('Specify the desired output format');
    }
    return suggestions;
  }

  identifyStrengths(prompt) {
    const strengths = [];
    if (prompt.includes('role')) strengths.push('Clear role definition');
    if (prompt.includes('instruction')) strengths.push('Specific instructions provided');
    if (prompt.includes('example')) strengths.push('Includes examples for clarity');
    return strengths.length > 0 ? strengths : ['Provides a basic framework for interaction'];
  }

  identifyWeaknesses(prompt) {
    const weaknesses = [];
    if (!prompt.includes('role')) weaknesses.push('Missing clear role definition');
    if (!prompt.includes('instruction')) weaknesses.push('Lacks specific instructions');
    if (!prompt.includes('example')) weaknesses.push('No examples provided');
    return weaknesses.length > 0 ? weaknesses : ['Could benefit from more specific guidance'];
  }
}

// Test function
function runTests() {
  console.log('🚀 LangGPT Prompt Assistant - Simple Test Demo\n');
  console.log('Based on the LangGPT framework: https://github.com/langgptai/LangGPT\n');

  const generator = new MockPromptGenerator();

  // Test 1: Generate Programming Assistant
  console.log('📝 Test 1: Generating Programming Assistant Prompt');
  console.log('='.repeat(60));
  
  const programmingResult = generator.generatePrompt({
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
  });

  console.log('\nGenerated Template:');
  console.log(programmingResult.template);
  console.log('\nUsage Instructions:');
  console.log(programmingResult.usage_instructions);
  console.log('\nTips:');
  programmingResult.tips.forEach(tip => console.log(`- ${tip}`));

  // Test 2: Generate Writing Assistant
  console.log('\n\n📝 Test 2: Generating Writing Assistant Prompt');
  console.log('='.repeat(60));
  
  const writingResult = generator.generatePrompt({
    role_type: 'assistant',
    domain: 'writing',
    specific_task: 'help with academic writing and research papers',
    expertise_level: 'expert',
    style: 'academic and formal',
    examples: true
  });

  console.log('\nGenerated Template:');
  console.log(writingResult.template);

  // Test 3: Analyze a simple prompt
  console.log('\n\n🔍 Test 3: Analyzing a Simple Prompt');
  console.log('='.repeat(60));
  
  const analysisResult = generator.analyzePrompt({
    prompt: 'You are a helpful assistant. Please help me with my questions.',
    analysis_type: 'effectiveness',
    target_audience: 'general users'
  });

  console.log('\nAnalysis Results:');
  console.log(`Structure Score: ${analysisResult.analysis.structure_score}/10`);
  console.log(`Clarity Score: ${analysisResult.analysis.clarity_score}/10`);
  console.log(`Completeness Score: ${analysisResult.analysis.completeness_score}/10`);
  console.log('\nStrengths:');
  analysisResult.analysis.strengths.forEach(s => console.log(`- ${s}`));
  console.log('\nWeaknesses:');
  analysisResult.analysis.weaknesses.forEach(w => console.log(`- ${w}`));
  console.log('\nSuggestions:');
  analysisResult.analysis.suggestions.forEach(s => console.log(`- ${s}`));

  // Test 4: Generate custom role
  console.log('\n\n🎨 Test 4: Generating Custom Role');
  console.log('='.repeat(60));
  
  const customResult = generator.generatePrompt({
    role_type: 'expert',
    domain: 'data science',
    specific_task: 'analyze datasets and provide insights',
    expertise_level: 'advanced',
    style: 'technical and analytical',
    requirements: [
      'Use statistical methods',
      'Provide visualizations',
      'Explain findings clearly'
    ]
  });

  console.log('\nGenerated Custom Template:');
  console.log(customResult.template);

  console.log('\n\n✅ All tests completed successfully!');
  console.log('\n🎯 This demonstrates the core LangGPT prompt generation capabilities.');
  console.log('📚 The full implementation includes MCP server integration for seamless AI tool usage.');
}

// Run the tests
runTests(); 