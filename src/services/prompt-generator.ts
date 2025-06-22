import { 
  PromptGenerationRequest, 
  PromptGenerationResponse,
  PromptAnalysisRequest,
  PromptAnalysisResponse,
  PromptOptimizationRequest,
  PromptOptimizationResponse,
  LangGPTRole
} from '../types/langgpt.js';
import { 
  generateLangGPTTemplate, 
  predefinedRoles, 
  promptAnalysisTemplate, 
  promptOptimizationTemplate 
} from '../templates/langgpt-templates.js';

export class PromptGeneratorService {
  
  /**
   * Generate a LangGPT-style prompt based on user requirements
   */
  async generatePrompt(request: PromptGenerationRequest): Promise<PromptGenerationResponse> {
    try {
      // Check if we have a predefined role that matches the request
      const predefinedRoleKey = this.findMatchingPredefinedRole(request);
      
      let role: LangGPTRole;
      let template: string;
      let variables: any[] = [];

      if (predefinedRoleKey) {
        // Use predefined role
        const predefinedRole = predefinedRoles[predefinedRoleKey];
        role = this.customizePredefinedRole(predefinedRole, request);
        template = this.generateTemplateFromRole(role);
      } else {
        // Generate custom role
        const promptTemplate = generateLangGPTTemplate(request);
        role = promptTemplate.role;
        template = promptTemplate.template;
        variables = promptTemplate.variables || [];
      }

      // Generate usage instructions
      const usageInstructions = this.generateUsageInstructions(role, request);

      // Generate tips
      const tips = this.generateTips(request);

      return {
        success: true,
        role,
        template,
        variables,
        usage_instructions: usageInstructions,
        tips
      };
    } catch (error) {
      console.error('Error generating prompt:', error);
      return {
        success: false,
        role: {} as LangGPTRole,
        template: '',
        usage_instructions: 'Error generating prompt',
        tips: ['Please check your input parameters and try again']
      };
    }
  }

  /**
   * Analyze an existing prompt for structure, effectiveness, and improvement opportunities
   */
  async analyzePrompt(request: PromptAnalysisRequest): Promise<PromptAnalysisResponse> {
    try {
      const analysisTemplate = promptAnalysisTemplate(request.prompt, request.analysis_type);
      
      // Perform analysis based on type
      const analysis = await this.performPromptAnalysis(request.prompt, request.analysis_type, request.target_audience, request.use_case);
      
      // Generate improved prompt if requested
      let improvedPrompt: string | undefined;
      if (request.analysis_type === 'improvement') {
        improvedPrompt = await this.generateImprovedPrompt(request.prompt, analysis.suggestions);
      }

      return {
        success: true,
        analysis,
        improved_prompt: improvedPrompt
      };
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      return {
        success: false,
        analysis: {
          structure_score: 0,
          clarity_score: 0,
          completeness_score: 0,
          suggestions: ['Error analyzing prompt'],
          strengths: [],
          weaknesses: ['Analysis failed'],
          recommendations: ['Please try again with a different prompt']
        }
      };
    }
  }

  /**
   * Optimize an existing prompt based on specified goals
   */
  async optimizePrompt(request: PromptOptimizationRequest): Promise<PromptOptimizationResponse> {
    try {
      const optimizationTemplate = promptOptimizationTemplate(request.original_prompt, request.optimization_goals);
      
      // Perform optimization
      const optimization = await this.performPromptOptimization(
        request.original_prompt,
        request.optimization_goals,
        request.constraints,
        request.target_length,
        request.style_preferences
      );

      return {
        success: true,
        optimized_prompt: optimization.optimized_prompt,
        changes_made: optimization.changes_made,
        improvement_metrics: optimization.metrics,
        explanation: optimization.explanation
      };
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      return {
        success: false,
        optimized_prompt: request.original_prompt,
        changes_made: ['Optimization failed'],
        improvement_metrics: {
          clarity_improvement: 0,
          conciseness_improvement: 0,
          structure_improvement: 0
        },
        explanation: 'Error occurred during optimization'
      };
    }
  }

  /**
   * Find a matching predefined role based on the request
   */
  private findMatchingPredefinedRole(request: PromptGenerationRequest): string | null {
    const domain = request.domain.toLowerCase();
    const roleType = request.role_type.toLowerCase();
    const task = request.specific_task.toLowerCase();

    // Check for exact matches
    if (domain.includes('programming') || domain.includes('coding') || domain.includes('software')) {
      return 'programming_assistant';
    }
    if (domain.includes('writing') || domain.includes('content') || domain.includes('copy')) {
      return 'writing_assistant';
    }
    if (domain.includes('data') || domain.includes('analytics') || domain.includes('statistics')) {
      return 'data_analyst';
    }
    if (domain.includes('research') || domain.includes('academic') || domain.includes('study')) {
      return 'research_assistant';
    }

    return null;
  }

  /**
   * Customize a predefined role based on specific requirements
   */
  private customizePredefinedRole(baseRole: LangGPTRole, request: PromptGenerationRequest): LangGPTRole {
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

  /**
   * Generate template from role definition
   */
  private generateTemplateFromRole(role: LangGPTRole): string {
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

${role.examples ? `## Examples
${role.examples.map((example, index) => `### Example ${index + 1}
${example}`).join('\n\n')}` : ''}

## Response
Please respond according to the above role definition and instructions.`;
  }

  /**
   * Generate usage instructions for the prompt
   */
  private generateUsageInstructions(role: LangGPTRole, request: PromptGenerationRequest): string {
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

  /**
   * Generate tips for effective prompt usage
   */
  private generateTips(request: PromptGenerationRequest): string[] {
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

    if (request.style) {
      tips.push(`Maintain the ${request.style} communication style in your interactions`);
    }

    return tips;
  }

  /**
   * Perform detailed prompt analysis
   */
  private async performPromptAnalysis(
    prompt: string, 
    analysisType: string, 
    targetAudience?: string, 
    useCase?: string
  ): Promise<any> {
    // Analyze prompt structure
    const structureScore = this.analyzeStructure(prompt);
    const clarityScore = this.analyzeClarity(prompt);
    const completenessScore = this.analyzeCompleteness(prompt);

    // Generate suggestions based on analysis type
    const suggestions = this.generateAnalysisSuggestions(prompt, analysisType, targetAudience, useCase);
    const strengths = this.identifyStrengths(prompt);
    const weaknesses = this.identifyWeaknesses(prompt);
    const recommendations = this.generateRecommendations(prompt, analysisType);

    return {
      structure_score: structureScore,
      clarity_score: clarityScore,
      completeness_score: completenessScore,
      suggestions,
      strengths,
      weaknesses,
      recommendations
    };
  }

  /**
   * Analyze prompt structure
   */
  private analyzeStructure(prompt: string): number {
    let score = 5; // Base score

    // Check for clear sections
    if (prompt.includes('##') || prompt.includes('**')) score += 1;
    if (prompt.includes('1.') || prompt.includes('-')) score += 1;
    
    // Check for logical flow
    if (prompt.includes('first') || prompt.includes('then') || prompt.includes('finally')) score += 1;
    
    // Check for role definition
    if (prompt.includes('role') || prompt.includes('assistant') || prompt.includes('expert')) score += 1;
    
    // Check for instructions
    if (prompt.includes('instruction') || prompt.includes('should') || prompt.includes('must')) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Analyze prompt clarity
   */
  private analyzeClarity(prompt: string): number {
    let score = 5; // Base score

    // Check for specific language
    if (prompt.includes('specific') || prompt.includes('detailed') || prompt.includes('clear')) score += 1;
    
    // Check for examples
    if (prompt.includes('example') || prompt.includes('instance')) score += 1;
    
    // Check for formatting
    if (prompt.includes('format') || prompt.includes('structure')) score += 1;
    
    // Check for constraints
    if (prompt.includes('constraint') || prompt.includes('limit') || prompt.includes('avoid')) score += 1;
    
    // Check for output specification
    if (prompt.includes('output') || prompt.includes('response') || prompt.includes('result')) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Analyze prompt completeness
   */
  private analyzeCompleteness(prompt: string): number {
    let score = 5; // Base score

    // Check for role definition
    if (prompt.includes('role') || prompt.includes('assistant')) score += 1;
    
    // Check for instructions
    if (prompt.includes('instruction') || prompt.includes('should')) score += 1;
    
    // Check for context
    if (prompt.includes('context') || prompt.includes('background')) score += 1;
    
    // Check for output format
    if (prompt.includes('format') || prompt.includes('output')) score += 1;
    
    // Check for examples
    if (prompt.includes('example') || prompt.includes('instance')) score += 1;

    return Math.min(score, 10);
  }

  /**
   * Generate analysis suggestions
   */
  private generateAnalysisSuggestions(prompt: string, analysisType: string, targetAudience?: string, useCase?: string): string[] {
    const suggestions: string[] = [];

    if (analysisType === 'structure') {
      if (!prompt.includes('##')) suggestions.push('Add clear section headers using markdown formatting');
      if (!prompt.includes('1.')) suggestions.push('Use numbered lists for step-by-step instructions');
      if (!prompt.includes('role')) suggestions.push('Include a clear role definition at the beginning');
    }

    if (analysisType === 'effectiveness') {
      if (!prompt.includes('example')) suggestions.push('Include specific examples to illustrate expectations');
      if (!prompt.includes('format')) suggestions.push('Specify the desired output format');
      if (!prompt.includes('constraint')) suggestions.push('Add constraints to guide the response');
    }

    if (analysisType === 'improvement') {
      suggestions.push('Break down complex instructions into smaller, clearer steps');
      suggestions.push('Add specific criteria for success or completion');
      suggestions.push('Include fallback instructions for edge cases');
    }

    if (targetAudience) {
      suggestions.push(`Adapt the language and complexity for ${targetAudience} audience`);
    }

    if (useCase) {
      suggestions.push(`Add context specific to the ${useCase} use case`);
    }

    return suggestions;
  }

  /**
   * Identify prompt strengths
   */
  private identifyStrengths(prompt: string): string[] {
    const strengths: string[] = [];

    if (prompt.includes('role')) strengths.push('Clear role definition');
    if (prompt.includes('instruction')) strengths.push('Specific instructions provided');
    if (prompt.includes('example')) strengths.push('Includes examples for clarity');
    if (prompt.includes('format')) strengths.push('Specifies output format');
    if (prompt.includes('constraint')) strengths.push('Sets clear boundaries and constraints');

    return strengths.length > 0 ? strengths : ['Provides a basic framework for interaction'];
  }

  /**
   * Identify prompt weaknesses
   */
  private identifyWeaknesses(prompt: string): string[] {
    const weaknesses: string[] = [];

    if (!prompt.includes('role')) weaknesses.push('Missing clear role definition');
    if (!prompt.includes('instruction')) weaknesses.push('Lacks specific instructions');
    if (!prompt.includes('example')) weaknesses.push('No examples provided');
    if (!prompt.includes('format')) weaknesses.push('Output format not specified');
    if (prompt.length < 100) weaknesses.push('Prompt may be too brief for complex tasks');

    return weaknesses.length > 0 ? weaknesses : ['Could benefit from more specific guidance'];
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(prompt: string, analysisType: string): string[] {
    const recommendations: string[] = [];

    if (analysisType === 'structure') {
      recommendations.push('Organize the prompt into clear sections with headers');
      recommendations.push('Use bullet points or numbered lists for better readability');
      recommendations.push('Add a logical flow from introduction to specific instructions');
    }

    if (analysisType === 'effectiveness') {
      recommendations.push('Add specific success criteria or expected outcomes');
      recommendations.push('Include examples of good and bad responses');
      recommendations.push('Specify the level of detail expected in responses');
    }

    if (analysisType === 'improvement') {
      recommendations.push('Test the prompt with different types of questions');
      recommendations.push('Iterate based on actual response quality');
      recommendations.push('Consider adding context-specific instructions');
    }

    return recommendations;
  }

  /**
   * Perform prompt optimization
   */
  private async performPromptOptimization(
    originalPrompt: string,
    goals: string[],
    constraints?: string[],
    targetLength?: number,
    stylePreferences?: any
  ): Promise<any> {
    let optimizedPrompt = originalPrompt;
    const changesMade: string[] = [];
    let clarityImprovement = 0;
    let concisenessImprovement = 0;
    let structureImprovement = 0;

    // Apply optimizations based on goals
    for (const goal of goals) {
      if (goal.toLowerCase().includes('clarity')) {
        optimizedPrompt = this.improveClarity(optimizedPrompt);
        changesMade.push('Improved clarity with more specific language');
        clarityImprovement += 2;
      }

      if (goal.toLowerCase().includes('conciseness')) {
        optimizedPrompt = this.improveConciseness(optimizedPrompt);
        changesMade.push('Reduced redundancy and improved conciseness');
        concisenessImprovement += 2;
      }

      if (goal.toLowerCase().includes('structure')) {
        optimizedPrompt = this.improveStructure(optimizedPrompt);
        changesMade.push('Enhanced structure with better organization');
        structureImprovement += 2;
      }
    }

    // Apply style preferences
    if (stylePreferences) {
      optimizedPrompt = this.applyStylePreferences(optimizedPrompt, stylePreferences);
      changesMade.push('Applied style preferences');
    }

    // Check target length
    if (targetLength) {
      const currentLength = optimizedPrompt.split(' ').length;
      if (currentLength > targetLength) {
        optimizedPrompt = this.reduceLength(optimizedPrompt, targetLength);
        changesMade.push(`Reduced length to approximately ${targetLength} words`);
      }
    }

    const explanation = `Optimized the prompt by focusing on: ${goals.join(', ')}. The changes improve the prompt's effectiveness while maintaining its core intent.`;

    return {
      optimized_prompt: optimizedPrompt,
      changes_made: changesMade,
      metrics: {
        clarity_improvement: Math.min(clarityImprovement, 10),
        conciseness_improvement: Math.min(concisenessImprovement, 10),
        structure_improvement: Math.min(structureImprovement, 10)
      },
      explanation
    };
  }

  /**
   * Improve prompt clarity
   */
  private improveClarity(prompt: string): string {
    // Replace vague terms with specific ones
    let improved = prompt
      .replace(/\bgood\b/gi, 'high-quality')
      .replace(/\bbad\b/gi, 'low-quality')
      .replace(/\bnice\b/gi, 'well-structured')
      .replace(/\bhelp\b/gi, 'assist with');

    // Add specific instructions where missing
    if (!improved.includes('specific') && !improved.includes('detailed')) {
      improved += '\n\nPlease provide specific, detailed responses.';
    }

    return improved;
  }

  /**
   * Improve prompt conciseness
   */
  private improveConciseness(prompt: string): string {
    // Remove redundant phrases
    let improved = prompt
      .replace(/\bvery\s+important\b/gi, 'important')
      .replace(/\babsolutely\s+essential\b/gi, 'essential')
      .replace(/\bcompletely\s+clear\b/gi, 'clear')
      .replace(/\bexactly\s+the\b/gi, 'the');

    // Remove unnecessary words
    improved = improved.replace(/\bkind\s+of\b/gi, '')
      .replace(/\bsort\s+of\b/gi, '')
      .replace(/\bactually\b/gi, '');

    return improved;
  }

  /**
   * Improve prompt structure
   */
  private improveStructure(prompt: string): string {
    let improved = prompt;

    // Add headers if missing
    if (!improved.includes('##') && !improved.includes('**')) {
      improved = `# Role Definition

${improved}

## Instructions
Please follow the above guidelines in your responses.`;
    }

    // Add bullet points for lists
    if (improved.includes('1.') && !improved.includes('-')) {
      improved = improved.replace(/(\d+\.\s+)/g, '- ');
    }

    return improved;
  }

  /**
   * Apply style preferences
   */
  private applyStylePreferences(prompt: string, preferences: any): string {
    let improved = prompt;

    if (preferences.formal) {
      improved = improved.replace(/\bdon't\b/gi, 'do not')
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not');
    }

    if (preferences.casual) {
      improved = improved.replace(/\bdo not\b/gi, "don't")
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bwill not\b/gi, "won't");
    }

    return improved;
  }

  /**
   * Reduce prompt length
   */
  private reduceLength(prompt: string, targetLength: number): string {
    const words = prompt.split(' ');
    if (words.length <= targetLength) return prompt;

    // Remove less important sections
    const sections = prompt.split('\n\n');
    const essentialSections = sections.filter(section => 
      section.includes('role') || 
      section.includes('instruction') || 
      section.includes('##')
    );

    return essentialSections.join('\n\n');
  }

  /**
   * Generate improved prompt
   */
  private async generateImprovedPrompt(originalPrompt: string, suggestions: string[]): Promise<string> {
    let improved = originalPrompt;

    // Apply suggestions
    if (suggestions.includes('Add clear section headers')) {
      improved = `# Role Definition

${improved}

## Instructions
Please follow the above guidelines in your responses.`;
    }

    if (suggestions.includes('Include specific examples')) {
      improved += '\n\n## Examples\n- Example 1: [Provide a specific example]\n- Example 2: [Provide another example]';
    }

    if (suggestions.includes('Specify the desired output format')) {
      improved += '\n\n## Output Format\nPlease provide responses in a clear, structured format with appropriate headings and bullet points.';
    }

    return improved;
  }
} 