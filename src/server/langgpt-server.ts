import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { CallToolResult, GetPromptResult } from '@modelcontextprotocol/sdk/types.js';
import { PromptGeneratorService } from '../services/prompt-generator.js';
import { 
  PromptGenerationRequestSchema,
  PromptAnalysisRequestSchema,
  PromptOptimizationRequestSchema,
  PromptGenerationResponseSchema,
  PromptAnalysisResponseSchema,
  PromptOptimizationResponseSchema
} from '../types/langgpt.js';

export class LangGPTServer {
  private server: McpServer;
  private promptGenerator: PromptGeneratorService;

  constructor() {
    this.server = new McpServer({
      name: 'langgpt-prompt-assistant',
      version: '1.0.0',
    }, { 
      capabilities: { 
        logging: {},
        prompts: {}
      } 
    });

    this.promptGenerator = new PromptGeneratorService();
    this.setupTools();
    this.setupPrompts();
  }

  private setupTools() {
    // Tool: Generate LangGPT Prompt
    this.server.registerTool(
      'generate_langgpt_prompt',
      {
        title: 'Generate LangGPT Prompt',
        description: 'Generate a structured LangGPT-style prompt based on role type, domain, and specific task',
        inputSchema: PromptGenerationRequestSchema.shape
      },
      async (params): Promise<CallToolResult> => {
        try {
          const result = await this.promptGenerator.generatePrompt(params as any);
          
          return {
            content: [
              {
                type: 'text',
                text: `## Generated LangGPT Prompt\n\n${result.template}\n\n## Usage Instructions\n\n${result.usage_instructions}\n\n## Tips\n\n${result.tips?.map(tip => `- ${tip}`).join('\n') || 'No specific tips available'}`
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error generating prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Tool: Analyze Prompt
    this.server.registerTool(
      'analyze_prompt',
      {
        title: 'Analyze Prompt',
        description: 'Analyze an existing prompt for structure, effectiveness, and improvement opportunities',
        inputSchema: PromptAnalysisRequestSchema.shape
      },
      async (params): Promise<CallToolResult> => {
        try {
          const result = await this.promptGenerator.analyzePrompt(params as any);
          
          let response = `## Prompt Analysis Results\n\n`;
          response += `**Structure Score:** ${result.analysis.structure_score}/10\n`;
          response += `**Clarity Score:** ${result.analysis.clarity_score}/10\n`;
          response += `**Completeness Score:** ${result.analysis.completeness_score}/10\n\n`;
          
          response += `### Strengths\n${result.analysis.strengths.map(s => `- ${s}`).join('\n')}\n\n`;
          response += `### Weaknesses\n${result.analysis.weaknesses.map(w => `- ${w}`).join('\n')}\n\n`;
          response += `### Suggestions\n${result.analysis.suggestions.map(s => `- ${s}`).join('\n')}\n\n`;
          response += `### Recommendations\n${result.analysis.recommendations.map(r => `- ${r}`).join('\n')}\n`;

          if (result.improved_prompt) {
            response += `\n### Improved Prompt\n\n${result.improved_prompt}`;
          }

          return {
            content: [
              {
                type: 'text',
                text: response
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error analyzing prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Tool: Optimize Prompt
    this.server.registerTool(
      'optimize_prompt',
      {
        title: 'Optimize Prompt',
        description: 'Optimize an existing prompt based on specified goals and constraints',
        inputSchema: PromptOptimizationRequestSchema.shape
      },
      async (params): Promise<CallToolResult> => {
        try {
          const result = await this.promptGenerator.optimizePrompt(params as any);
          
          let response = `## Prompt Optimization Results\n\n`;
          response += `### Optimized Prompt\n\n${result.optimized_prompt}\n\n`;
          response += `### Changes Made\n${result.changes_made.map(c => `- ${c}`).join('\n')}\n\n`;
          response += `### Improvement Metrics\n`;
          response += `- Clarity Improvement: +${result.improvement_metrics.clarity_improvement}/10\n`;
          response += `- Conciseness Improvement: +${result.improvement_metrics.conciseness_improvement}/10\n`;
          response += `- Structure Improvement: +${result.improvement_metrics.structure_improvement}/10\n\n`;
          response += `### Explanation\n${result.explanation}`;

          return {
            content: [
              {
                type: 'text',
                text: response
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error optimizing prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );

    // Tool: Get Predefined Roles
    this.server.registerTool(
      'get_predefined_roles',
      {
        title: 'Get Predefined Roles',
        description: 'Get a list of available predefined LangGPT roles',
        inputSchema: {
          category: z.string().optional().describe('Filter by category (programming, writing, analysis, research)')
        }
      },
      async (params): Promise<CallToolResult> => {
        try {
          const roles = [
            {
              name: 'programming_assistant',
              title: 'Programming Assistant',
              description: 'Expert programming assistant for code development, debugging, and best practices',
              category: 'programming'
            },
            {
              name: 'writing_assistant',
              title: 'Writing Assistant',
              description: 'Professional writing assistant for content creation, editing, and style improvement',
              category: 'writing'
            },
            {
              name: 'data_analyst',
              title: 'Data Analyst',
              description: 'Data analysis expert for data interpretation, visualization, and insights',
              category: 'analysis'
            },
            {
              name: 'research_assistant',
              title: 'Research Assistant',
              description: 'Research assistant for literature review, methodology, and academic writing',
              category: 'research'
            }
          ];

          const filteredRoles = params.category 
            ? roles.filter(role => role.category === params.category)
            : roles;

          const response = `## Available Predefined Roles\n\n${filteredRoles.map(role => 
            `### ${role.title}\n- **Name:** ${role.name}\n- **Description:** ${role.description}\n- **Category:** ${role.category}\n`
          ).join('\n')}`;

          return {
            content: [
              {
                type: 'text',
                text: response
              }
            ]
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting predefined roles: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            ]
          };
        }
      }
    );
  }

  private setupPrompts() {
    // Prompt: Quick Role Generator
    this.server.registerPrompt(
      'quick_role_generator',
      {
        title: 'Quick Role Generator',
        description: 'Generate a basic LangGPT role quickly with minimal input',
        argsSchema: {
          role_name: z.string().describe('Name of the role (e.g., "Python Developer", "Content Writer")'),
          main_task: z.string().describe('Main task or responsibility of the role'),
          expertise_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional().describe('Expertise level required')
        }
      },
      async ({ role_name, main_task, expertise_level }): Promise<GetPromptResult> => {
        const level = expertise_level || 'intermediate';
        
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Generate a LangGPT role for a ${level} level ${role_name} whose main task is to ${main_task}. Include a clear role definition, skills, constraints, and instructions.`
              }
            }
          ]
        };
      }
    );

    // Prompt: Prompt Analyzer
    this.server.registerPrompt(
      'prompt_analyzer',
      {
        title: 'Prompt Analyzer',
        description: 'Analyze and improve an existing prompt',
        argsSchema: {
          prompt_text: z.string().describe('The prompt to analyze'),
          analysis_focus: z.enum(['structure', 'clarity', 'effectiveness', 'completeness']).describe('What aspect to focus on'),
          target_audience: z.string().optional().describe('Target audience for the prompt')
        }
      },
      async ({ prompt_text, analysis_focus, target_audience }): Promise<GetPromptResult> => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Analyze this prompt focusing on ${analysis_focus}${target_audience ? ` for ${target_audience} audience` : ''}:\n\n"${prompt_text}"\n\nProvide specific suggestions for improvement and an enhanced version.`
              }
            }
          ]
        };
      }
    );

    // Prompt: Role Customizer
    this.server.registerPrompt(
      'role_customizer',
      {
        title: 'Role Customizer',
        description: 'Customize a predefined role for specific needs',
        argsSchema: {
          base_role: z.string().describe('Base role to customize (programming_assistant, writing_assistant, data_analyst, research_assistant)'),
          custom_domain: z.string().describe('Specific domain or field'),
          additional_skills: z.string().optional().describe('Additional skills to add'),
          specific_constraints: z.string().optional().describe('Specific constraints or limitations')
        }
      },
      async ({ base_role, custom_domain, additional_skills, specific_constraints }): Promise<GetPromptResult> => {
        return {
          messages: [
            {
              role: 'user',
              content: {
                type: 'text',
                text: `Customize the ${base_role} role for the ${custom_domain} domain.${additional_skills ? ` Add these skills: ${additional_skills}` : ''}${specific_constraints ? ` Add these constraints: ${specific_constraints}` : ''}\n\nProvide the customized role definition with all necessary sections.`
              }
            }
          ]
        };
      }
    );
  }

  /**
   * Start the server with HTTP transport
   */
  async start(port: number = 3000) {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => `langgpt-${Date.now()}`
    });

    await this.server.connect(transport);
    console.log(`LangGPT Prompt Assistant server running on port ${port}`);
    
    return this.server;
  }

  /**
   * Get the underlying MCP server instance
   */
  getServer(): McpServer {
    return this.server;
  }
} 