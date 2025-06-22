import { z } from 'zod';

// LangGPT Role Structure Types
export const LangGPTRoleSchema = z.object({
  name: z.string().describe('The name of the role'),
  description: z.string().describe('A clear description of what this role does'),
  instructions: z.string().describe('Detailed instructions for the role'),
  examples: z.array(z.string()).optional().describe('Example inputs and outputs'),
  input_format: z.object({
    type: z.string().describe('The type of input expected'),
    properties: z.record(z.any()).optional().describe('Properties of the input format')
  }).optional(),
  output_format: z.object({
    type: z.string().describe('The type of output expected'),
    properties: z.record(z.any()).optional().describe('Properties of the output format')
  }).optional(),
  constraints: z.array(z.string()).optional().describe('Constraints and limitations'),
  skills: z.array(z.string()).optional().describe('Skills and capabilities'),
  tools: z.array(z.string()).optional().describe('Tools the role can use'),
  workflow: z.array(z.string()).optional().describe('Step-by-step workflow'),
  background: z.string().optional().describe('Background context and knowledge')
});

export type LangGPTRole = z.infer<typeof LangGPTRoleSchema>;

// Prompt Template Types
export const PromptTemplateSchema = z.object({
  name: z.string().describe('Template name'),
  description: z.string().describe('Template description'),
  category: z.string().describe('Template category'),
  role: LangGPTRoleSchema,
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    default: z.any().optional()
  })).optional(),
  template: z.string().describe('The actual prompt template'),
  examples: z.array(z.object({
    input: z.record(z.any()),
    output: z.string()
  })).optional()
});

export type PromptTemplate = z.infer<typeof PromptTemplateSchema>;

// Prompt Generation Request
export const PromptGenerationRequestSchema = z.object({
  role_type: z.string().describe('Type of role to generate (e.g., "assistant", "expert", "tutor")'),
  domain: z.string().describe('Domain or field (e.g., "programming", "writing", "analysis")'),
  specific_task: z.string().describe('Specific task or function'),
  requirements: z.array(z.string()).optional().describe('Additional requirements'),
  constraints: z.array(z.string()).optional().describe('Constraints or limitations'),
  style: z.string().optional().describe('Communication style'),
  expertise_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  output_format: z.string().optional().describe('Desired output format'),
  examples: z.boolean().optional().describe('Whether to include examples')
});

export type PromptGenerationRequest = z.infer<typeof PromptGenerationRequestSchema>;

// Prompt Analysis Request
export const PromptAnalysisRequestSchema = z.object({
  prompt: z.string().describe('The prompt to analyze'),
  analysis_type: z.enum(['structure', 'effectiveness', 'improvement', 'completeness']).describe('Type of analysis'),
  target_audience: z.string().optional().describe('Target audience'),
  use_case: z.string().optional().describe('Intended use case')
});

export type PromptAnalysisRequest = z.infer<typeof PromptAnalysisRequestSchema>;

// Prompt Optimization Request
export const PromptOptimizationRequestSchema = z.object({
  original_prompt: z.string().describe('Original prompt to optimize'),
  optimization_goals: z.array(z.string()).describe('Goals for optimization'),
  constraints: z.array(z.string()).optional().describe('Constraints to maintain'),
  target_length: z.number().optional().describe('Target length in words'),
  style_preferences: z.record(z.any()).optional().describe('Style preferences')
});

export type PromptOptimizationRequest = z.infer<typeof PromptOptimizationRequestSchema>;

// Response Types
export const PromptGenerationResponseSchema = z.object({
  success: z.boolean(),
  role: LangGPTRoleSchema,
  template: z.string(),
  variables: z.array(z.object({
    name: z.string(),
    description: z.string(),
    type: z.string(),
    required: z.boolean()
  })).optional(),
  usage_instructions: z.string(),
  tips: z.array(z.string()).optional()
});

export type PromptGenerationResponse = z.infer<typeof PromptGenerationResponseSchema>;

export const PromptAnalysisResponseSchema = z.object({
  success: z.boolean(),
  analysis: z.object({
    structure_score: z.number().min(0).max(10),
    clarity_score: z.number().min(0).max(10),
    completeness_score: z.number().min(0).max(10),
    suggestions: z.array(z.string()),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string())
  }),
  improved_prompt: z.string().optional()
});

export type PromptAnalysisResponse = z.infer<typeof PromptAnalysisResponseSchema>;

export const PromptOptimizationResponseSchema = z.object({
  success: z.boolean(),
  optimized_prompt: z.string(),
  changes_made: z.array(z.string()),
  improvement_metrics: z.object({
    clarity_improvement: z.number(),
    conciseness_improvement: z.number(),
    structure_improvement: z.number()
  }),
  explanation: z.string()
});

export type PromptOptimizationResponse = z.infer<typeof PromptOptimizationResponseSchema>; 