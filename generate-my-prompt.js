/**
 * Generate your own custom LangGPT prompt
 * Modify the parameters below to create your desired prompt
 */

// Mock LangGPT generator (same as test-simple.js)
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
  }
};

class MockPromptGenerator {
  generatePrompt(request) {
    console.log('🎯 Generating LangGPT prompt with your parameters:');
    console.log(JSON.stringify(request, null, 2));
    console.log('\n' + '='.repeat(60) + '\n');
    
    const role = this.generateCustomRole(request);
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
        'Problem-solving and analytical thinking',
        ...(request.additional_skills || [])
      ],
      constraints: [
        ...(request.constraints || []),
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
}

// ========================================
// 🎯 MODIFY THESE PARAMETERS TO GENERATE YOUR PROMPT
// ========================================

const myPromptRequest = {
  role_type: 'assistant',           // 'assistant', 'expert', 'tutor', 'consultant'
  domain: 'programming',            // 'programming', 'writing', 'analysis', 'research', 'design', etc.
  specific_task: 'help with web development using React and Node.js',
  expertise_level: 'expert',        // 'beginner', 'intermediate', 'advanced', 'expert'
  style: 'professional and educational',
  requirements: [
    'Provide code examples with explanations',
    'Explain best practices and patterns',
    'Include debugging tips and troubleshooting',
    'Suggest performance optimizations'
  ],
  constraints: [
    'Always prioritize code security',
    'Provide explanations for complex concepts',
    'Include error handling in examples'
  ],
  additional_skills: [
    'Modern JavaScript (ES6+)',
    'React hooks and functional components',
    'Node.js backend development',
    'API design and integration'
  ]
};

// ========================================
// 🚀 GENERATE YOUR PROMPT
// ========================================

function generateMyPrompt() {
  console.log('🚀 Generating Your Custom LangGPT Prompt\n');
  console.log('Based on the LangGPT framework: https://github.com/langgptai/LangGPT\n');
  
  const generator = new MockPromptGenerator();
  const result = generator.generatePrompt(myPromptRequest);
  
  console.log('📝 Your Generated LangGPT Prompt:');
  console.log('='.repeat(60));
  console.log(result.template);
  
  console.log('\n📖 Usage Instructions:');
  console.log('='.repeat(60));
  console.log(result.usage_instructions);
  
  console.log('\n💡 Tips for Best Results:');
  console.log('='.repeat(60));
  result.tips.forEach(tip => console.log(`- ${tip}`));
  
  console.log('\n✅ Your prompt is ready to use!');
  console.log('📋 Copy the template above and paste it into your AI assistant.');
}

// Generate the prompt
generateMyPrompt(); 