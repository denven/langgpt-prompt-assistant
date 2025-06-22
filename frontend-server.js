#!/usr/bin/env node

/**
 * Frontend Server for LangGPT Prompt Assistant
 * Serves the web interface and provides API endpoints
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// MCP Client setup (optional - for future backend integration)
let mcpClient = null;

async function setupMCPClient() {
    try {
        mcpClient = new Client({
            name: 'langgpt-frontend-client',
            version: '1.0.0'
        });

        const transport = new StreamableHTTPClientTransport(
            new URL('http://localhost:3000')
        );

        await mcpClient.connect(transport);
        console.log('✅ Connected to LangGPT MCP server');
        return true;
    } catch (error) {
        console.log('⚠️  MCP server not available, using mock responses');
        return false;
    }
}

// API Routes
app.post('/api/generate-prompt', async (req, res) => {
    try {
        const requestData = req.body;
        
        if (mcpClient) {
            // Use actual MCP server
            const result = await mcpClient.callTool({
                name: 'generate_langgpt_prompt',
                arguments: requestData
            });
            
            res.json({
                success: true,
                data: result
            });
        } else {
            // Mock response
            const mockResult = await generateMockPrompt(requestData);
            res.json({
                success: true,
                data: mockResult
            });
        }
    } catch (error) {
        console.error('Error generating prompt:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/analyze-prompt', async (req, res) => {
    try {
        const requestData = req.body;
        
        if (mcpClient) {
            // Use actual MCP server
            const result = await mcpClient.callTool({
                name: 'analyze_prompt',
                arguments: requestData
            });
            
            res.json({
                success: true,
                data: result
            });
        } else {
            // Mock response
            const mockResult = await analyzeMockPrompt(requestData);
            res.json({
                success: true,
                data: mockResult
            });
        }
    } catch (error) {
        console.error('Error analyzing prompt:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.post('/api/optimize-prompt', async (req, res) => {
    try {
        const requestData = req.body;
        
        if (mcpClient) {
            // Use actual MCP server
            const result = await mcpClient.callTool({
                name: 'optimize_prompt',
                arguments: requestData
            });
            
            res.json({
                success: true,
                data: result
            });
        } else {
            // Mock response
            const mockResult = await optimizeMockPrompt(requestData);
            res.json({
                success: true,
                data: mockResult
            });
        }
    } catch (error) {
        console.error('Error optimizing prompt:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.get('/api/templates', (req, res) => {
    const templates = [
        {
            id: 'programming',
            name: 'Programming Assistant',
            description: 'Expert programming assistant for code development, debugging, and best practices',
            icon: 'fas fa-code',
            category: 'programming'
        },
        {
            id: 'writing',
            name: 'Writing Assistant',
            description: 'Professional writing assistant for content creation, editing, and style improvement',
            icon: 'fas fa-pen',
            category: 'writing'
        },
        {
            id: 'analysis',
            name: 'Data Analyst',
            description: 'Data analysis expert for data interpretation, visualization, and insights',
            icon: 'fas fa-chart-line',
            category: 'analysis'
        },
        {
            id: 'research',
            name: 'Research Assistant',
            description: 'Research assistant for literature review, methodology, and academic writing',
            icon: 'fas fa-microscope',
            category: 'research'
        }
    ];
    
    res.json({
        success: true,
        data: templates
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        mcpConnected: mcpClient !== null,
        timestamp: new Date().toISOString()
    });
});

// Mock implementations (same as frontend)
async function generateMockPrompt(requestData) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const role = {
        name: `${requestData.role_type.charAt(0).toUpperCase() + requestData.role_type.slice(1)} ${requestData.domain.charAt(0).toUpperCase() + requestData.domain.slice(1)}`,
        description: `A ${requestData.expertise_level || 'expert'} ${requestData.role_type} in the field of ${requestData.domain} with focus on ${requestData.specific_task}`,
        instructions: `You are a ${requestData.expertise_level || 'expert'} ${requestData.role_type} in the field of ${requestData.domain}. Your primary responsibility is to ${requestData.specific_task}.

${requestData.requirements ? `Additional Requirements:
${requestData.requirements.map(req => `- ${req}`).join('\n')}` : ''}

${requestData.style ? `Communication Style: ${requestData.style}` : ''}

Please provide clear, accurate, and helpful assistance while maintaining professional standards.`,
        skills: [
            `Expert knowledge in ${requestData.domain}`,
            `Proficiency in ${requestData.specific_task}`,
            'Clear communication and explanation',
            'Problem-solving and analytical thinking',
            ...(requestData.additional_skills || [])
        ],
        constraints: [
            ...(requestData.constraints || []),
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

    const template = generateTemplate(role);
    const usageInstructions = generateUsageInstructions(role, requestData);
    const tips = generateTips(requestData);

    return {
        content: [{
            type: 'text',
            text: `## Generated LangGPT Prompt\n\n${template}\n\n## Usage Instructions\n\n${usageInstructions}\n\n## Tips\n\n${tips.map(tip => `- ${tip}`).join('\n')}`
        }]
    };
}

async function analyzeMockPrompt(requestData) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const prompt = requestData.prompt;
    const structureScore = analyzeStructure(prompt);
    const clarityScore = analyzeClarity(prompt);
    const completenessScore = analyzeCompleteness(prompt);

    return {
        content: [{
            type: 'text',
            text: `## Prompt Analysis Results

**Structure Score:** ${structureScore}/10
**Clarity Score:** ${clarityScore}/10
**Completeness Score:** ${completenessScore}/10

### Strengths
${identifyStrengths(prompt).map(s => `- ${s}`).join('\n')}

### Weaknesses
${identifyWeaknesses(prompt).map(w => `- ${w}`).join('\n')}

### Suggestions
${generateAnalysisSuggestions(prompt, requestData.analysis_type).map(s => `- ${s}`).join('\n')}

### Recommendations
- Consider adding more specific instructions
- Include examples for better clarity
- Define clear output format expectations`
        }]
    };
}

async function optimizeMockPrompt(requestData) {
    await new Promise(resolve => setTimeout(resolve, 1200));

    let optimizedPrompt = requestData.original_prompt;
    const changesMade = [];

    if (requestData.optimization_goals.includes('clarity')) {
        optimizedPrompt = improveClarity(optimizedPrompt);
        changesMade.push('Improved clarity with more specific language');
    }

    if (requestData.optimization_goals.includes('structure')) {
        optimizedPrompt = improveStructure(optimizedPrompt);
        changesMade.push('Enhanced structure with better organization');
    }

    if (requestData.optimization_goals.includes('conciseness')) {
        optimizedPrompt = improveConciseness(optimizedPrompt);
        changesMade.push('Reduced redundancy and improved conciseness');
    }

    return {
        content: [{
            type: 'text',
            text: `## Prompt Optimization Results

### Optimized Prompt

${optimizedPrompt}

### Changes Made
${changesMade.map(c => `- ${c}`).join('\n')}

### Improvement Metrics
- Clarity Improvement: +2/10
- Conciseness Improvement: +1/10
- Structure Improvement: +2/10

### Explanation
Optimized the prompt by focusing on: ${requestData.optimization_goals.join(', ')}. The changes improve the prompt's effectiveness while maintaining its core intent.`
        }]
    };
}

// Helper functions (same as frontend)
function generateTemplate(role) {
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

function generateUsageInstructions(role, requestData) {
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
   "I need help with ${requestData.specific_task} in the context of ${requestData.domain}. Can you assist me with [specific question]?"

5. **Iterate and improve**:
   - Test the prompt with different types of questions
   - Refine based on the responses you receive
   - Adjust the role definition as needed for better results`;
}

function generateTips(requestData) {
    const tips = [
        'Start with clear, specific questions to get the best responses',
        'Provide context and background information when relevant',
        'Be explicit about your desired output format and style',
        'Use the role\'s expertise level appropriately in your questions',
        'Iterate and refine the prompt based on initial results'
    ];

    if (requestData.expertise_level === 'beginner') {
        tips.push('Ask for explanations of complex concepts and terminology');
        tips.push('Request step-by-step guidance for complex tasks');
    }

    if (requestData.expertise_level === 'expert') {
        tips.push('Feel free to ask for advanced techniques and optimizations');
        tips.push('Request detailed technical analysis and comparisons');
    }

    return tips;
}

function analyzeStructure(prompt) {
    let score = 5;
    if (prompt.includes('##') || prompt.includes('**')) score += 1;
    if (prompt.includes('1.') || prompt.includes('-')) score += 1;
    if (prompt.includes('role') || prompt.includes('assistant')) score += 1;
    if (prompt.includes('instruction') || prompt.includes('should')) score += 1;
    return Math.min(score, 10);
}

function analyzeClarity(prompt) {
    let score = 5;
    if (prompt.includes('specific') || prompt.includes('detailed')) score += 1;
    if (prompt.includes('example')) score += 1;
    if (prompt.includes('format')) score += 1;
    if (prompt.includes('constraint')) score += 1;
    return Math.min(score, 10);
}

function analyzeCompleteness(prompt) {
    let score = 5;
    if (prompt.includes('role')) score += 1;
    if (prompt.includes('instruction')) score += 1;
    if (prompt.includes('context')) score += 1;
    if (prompt.includes('format')) score += 1;
    return Math.min(score, 10);
}

function identifyStrengths(prompt) {
    const strengths = [];
    if (prompt.includes('role')) strengths.push('Clear role definition');
    if (prompt.includes('instruction')) strengths.push('Specific instructions provided');
    if (prompt.includes('example')) strengths.push('Includes examples for clarity');
    return strengths.length > 0 ? strengths : ['Provides a basic framework for interaction'];
}

function identifyWeaknesses(prompt) {
    const weaknesses = [];
    if (!prompt.includes('role')) weaknesses.push('Missing clear role definition');
    if (!prompt.includes('instruction')) weaknesses.push('Lacks specific instructions');
    if (!prompt.includes('example')) weaknesses.push('No examples provided');
    return weaknesses.length > 0 ? weaknesses : ['Could benefit from more specific guidance'];
}

function generateAnalysisSuggestions(prompt, analysisType) {
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

function improveClarity(prompt) {
    let improved = prompt
        .replace(/\bgood\b/gi, 'high-quality')
        .replace(/\bbad\b/gi, 'low-quality')
        .replace(/\bnice\b/gi, 'well-structured');
    
    if (!improved.includes('specific') && !improved.includes('detailed')) {
        improved += '\n\nPlease provide specific, detailed responses.';
    }
    return improved;
}

function improveStructure(prompt) {
    let improved = prompt;
    if (!improved.includes('##') && !improved.includes('**')) {
        improved = `# Role Definition\n\n${improved}\n\n## Instructions\nPlease follow the above guidelines in your responses.`;
    }
    return improved;
}

function improveConciseness(prompt) {
    return prompt
        .replace(/\bvery\s+important\b/gi, 'important')
        .replace(/\babsolutely\s+essential\b/gi, 'essential')
        .replace(/\bcompletely\s+clear\b/gi, 'clear');
}

// Start server
async function startServer() {
    try {
        // Try to connect to MCP server
        await setupMCPClient();
        
        app.listen(PORT, () => {
            console.log(`🚀 LangGPT Prompt Assistant Frontend Server running on http://localhost:${PORT}`);
            console.log(`📁 Serving static files from: ${path.join(__dirname, 'frontend')}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
            
            if (mcpClient) {
                console.log(`✅ Connected to MCP backend at http://localhost:3000`);
            } else {
                console.log(`⚠️  Using mock responses (MCP backend not available)`);
                console.log(`💡 Start the MCP server with: npm run start`);
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (mcpClient) {
        await mcpClient.close();
    }
    process.exit(0);
});

// Start the server
startServer(); 