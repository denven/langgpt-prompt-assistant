// LangGPT Prompt Assistant Frontend JavaScript

class LangGPTPromptAssistant {
    constructor() {
        this.initializeEventListeners();
        this.setupTabNavigation();
        this.setupTemplateCards();
    }

    initializeEventListeners() {
        // Form submissions
        document.getElementById('promptForm').addEventListener('submit', (e) => this.handlePromptGeneration(e));
        document.getElementById('analyzerForm').addEventListener('submit', (e) => this.handlePromptAnalysis(e));
        document.getElementById('optimizerForm').addEventListener('submit', (e) => this.handlePromptOptimization(e));
        
        // Clear form button
        document.getElementById('clearForm').addEventListener('click', () => this.clearPromptForm());
        
        // Copy and download buttons
        document.getElementById('copyPrompt').addEventListener('click', () => this.copyPrompt());
        document.getElementById('downloadPrompt').addEventListener('click', () => this.downloadPrompt());
    }

    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and panels
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding panel
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    setupTemplateCards() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', () => {
                const templateType = card.getAttribute('data-template');
                this.loadTemplate(templateType);
            });
        });
    }

    async handlePromptGeneration(e) {
        e.preventDefault();
        this.showLoading();

        try {
            const formData = new FormData(e.target);
            const requestData = {
                role_type: formData.get('roleType'),
                domain: formData.get('domain'),
                specific_task: formData.get('specificTask'),
                expertise_level: formData.get('expertiseLevel'),
                style: formData.get('style'),
                requirements: this.parseTextarea(formData.get('requirements')),
                constraints: this.parseTextarea(formData.get('constraints')),
                additional_skills: this.parseTextarea(formData.get('additionalSkills'))
            };

            // For now, use the mock generator since the server isn't accessible via HTTP
            const result = await this.generatePromptMock(requestData);
            this.displayPromptResult(result);
            this.showToast('Prompt generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating prompt:', error);
            this.showToast('Error generating prompt. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handlePromptAnalysis(e) {
        e.preventDefault();
        this.showLoading();

        try {
            const formData = new FormData(e.target);
            const requestData = {
                prompt: formData.get('promptToAnalyze'),
                analysis_type: formData.get('analysisType'),
                target_audience: formData.get('targetAudience') || undefined
            };

            const result = await this.analyzePromptMock(requestData);
            this.displayAnalysisResult(result);
            this.showToast('Prompt analyzed successfully!', 'success');
        } catch (error) {
            console.error('Error analyzing prompt:', error);
            this.showToast('Error analyzing prompt. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    async handlePromptOptimization(e) {
        e.preventDefault();
        this.showLoading();

        try {
            const formData = new FormData(e.target);
            const requestData = {
                original_prompt: formData.get('promptToOptimize'),
                optimization_goals: this.parseTextarea(formData.get('optimizationGoals')),
                constraints: this.parseTextarea(formData.get('optimizationConstraints')),
                target_length: formData.get('targetLength') ? parseInt(formData.get('targetLength')) : undefined,
                style_preferences: formData.get('stylePreference') ? { style: formData.get('stylePreference') } : undefined
            };

            const result = await this.optimizePromptMock(requestData);
            this.displayOptimizationResult(result);
            this.showToast('Prompt optimized successfully!', 'success');
        } catch (error) {
            console.error('Error optimizing prompt:', error);
            this.showToast('Error optimizing prompt. Please try again.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Mock implementations (since we can't access the MCP server via HTTP)
    async generatePromptMock(requestData) {
        // Simulate API delay
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

        const template = this.generateTemplate(role);
        const usageInstructions = this.generateUsageInstructions(role, requestData);
        const tips = this.generateTips(requestData);

        return {
            success: true,
            role,
            template,
            usage_instructions: usageInstructions,
            tips
        };
    }

    async analyzePromptMock(requestData) {
        await new Promise(resolve => setTimeout(resolve, 800));

        const prompt = requestData.prompt;
        const structureScore = this.analyzeStructure(prompt);
        const clarityScore = this.analyzeClarity(prompt);
        const completenessScore = this.analyzeCompleteness(prompt);

        return {
            success: true,
            analysis: {
                structure_score: structureScore,
                clarity_score: clarityScore,
                completeness_score: completenessScore,
                strengths: this.identifyStrengths(prompt),
                weaknesses: this.identifyWeaknesses(prompt),
                suggestions: this.generateAnalysisSuggestions(prompt, requestData.analysis_type),
                recommendations: [
                    'Consider adding more specific instructions',
                    'Include examples for better clarity',
                    'Define clear output format expectations'
                ]
            }
        };
    }

    async optimizePromptMock(requestData) {
        await new Promise(resolve => setTimeout(resolve, 1200));

        let optimizedPrompt = requestData.original_prompt;
        const changesMade = [];

        // Apply optimizations based on goals
        if (requestData.optimization_goals.includes('clarity')) {
            optimizedPrompt = this.improveClarity(optimizedPrompt);
            changesMade.push('Improved clarity with more specific language');
        }

        if (requestData.optimization_goals.includes('structure')) {
            optimizedPrompt = this.improveStructure(optimizedPrompt);
            changesMade.push('Enhanced structure with better organization');
        }

        if (requestData.optimization_goals.includes('conciseness')) {
            optimizedPrompt = this.improveConciseness(optimizedPrompt);
            changesMade.push('Reduced redundancy and improved conciseness');
        }

        return {
            success: true,
            optimized_prompt: optimizedPrompt,
            changes_made: changesMade,
            improvement_metrics: {
                clarity_improvement: 2,
                conciseness_improvement: 1,
                structure_improvement: 2
            },
            explanation: `Optimized the prompt by focusing on: ${requestData.optimization_goals.join(', ')}. The changes improve the prompt's effectiveness while maintaining its core intent.`
        };
    }

    // Helper methods
    convertMarkdownToHtml(markdown) {
        if (!markdown) return '';
        return marked.parse(markdown);
    }

    generateTemplate(role) {
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

    generateUsageInstructions(role, requestData) {
        return `1. **Copy the template above** and paste it into your AI assistant's system prompt or role definition.

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

    generateTips(requestData) {
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

    parseTextarea(value) {
        if (!value) return [];
        return value.split('\n').filter(line => line.trim() !== '');
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

    improveClarity(prompt) {
        let improved = prompt
            .replace(/\bgood\b/gi, 'high-quality')
            .replace(/\bbad\b/gi, 'low-quality')
            .replace(/\bnice\b/gi, 'well-structured');
        
        if (!improved.includes('specific') && !improved.includes('detailed')) {
            improved += '\n\nPlease provide specific, detailed responses.';
        }
        return improved;
    }

    improveStructure(prompt) {
        let improved = prompt;
        if (!improved.includes('##') && !improved.includes('**')) {
            improved = `# Role Definition\n\n${improved}\n\n## Instructions\nPlease follow the above guidelines in your responses.`;
        }
        return improved;
    }

    improveConciseness(prompt) {
        return prompt
            .replace(/\bvery\s+important\b/gi, 'important')
            .replace(/\babsolutely\s+essential\b/gi, 'essential')
            .replace(/\bcompletely\s+clear\b/gi, 'clear');
    }

    // UI Methods
    displayPromptResult(result) {
        const resultContainer = document.getElementById('generatorResult');
        const promptOutput = document.getElementById('promptOutput');
        const usageInstructions = document.getElementById('usageInstructions');
        const tips = document.getElementById('tips');

        promptOutput.textContent = result.template;
        usageInstructions.innerHTML = `<h4>Usage Instructions</h4>${this.convertMarkdownToHtml(result.usage_instructions)}`;
        tips.innerHTML = `<h4>Tips for Best Results</h4><ul>${result.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>`;

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    displayAnalysisResult(result) {
        const resultContainer = document.getElementById('analyzerResult');
        const analysisOutput = document.getElementById('analysisOutput');

        const analysis = result.analysis;
        analysisOutput.innerHTML = `
            <div class="analysis-scores">
                <div class="score-item">
                    <span class="score-label">Structure Score:</span>
                    <span class="score-value">${analysis.structure_score}/10</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Clarity Score:</span>
                    <span class="score-value">${analysis.clarity_score}/10</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Completeness Score:</span>
                    <span class="score-value">${analysis.completeness_score}/10</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>Strengths</h4>
                <ul>${analysis.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            
            <div class="analysis-section">
                <h4>Weaknesses</h4>
                <ul>${analysis.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
            </div>
            
            <div class="analysis-section">
                <h4>Suggestions</h4>
                <ul>${analysis.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
            
            <div class="analysis-section">
                <h4>Recommendations</h4>
                <ul>${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
            </div>
        `;

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    displayOptimizationResult(result) {
        const resultContainer = document.getElementById('optimizerResult');
        const optimizationOutput = document.getElementById('optimizationOutput');

        optimizationOutput.innerHTML = `
            <div class="optimized-prompt">
                <h4>Optimized Prompt</h4>
                <div class="prompt-output">${result.optimized_prompt}</div>
            </div>
            
            <div class="optimization-details">
                <h4>Changes Made</h4>
                <ul>${result.changes_made.map(c => `<li>${c}</li>`).join('')}</ul>
                
                <h4>Improvement Metrics</h4>
                <ul>
                    <li>Clarity Improvement: +${result.improvement_metrics.clarity_improvement}/10</li>
                    <li>Conciseness Improvement: +${result.improvement_metrics.conciseness_improvement}/10</li>
                    <li>Structure Improvement: +${result.improvement_metrics.structure_improvement}/10</li>
                </ul>
                
                <h4>Explanation</h4>
                <p>${result.explanation}</p>
            </div>
        `;

        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
    }

    loadTemplate(templateType) {
        const templates = {
            programming: {
                roleType: 'assistant',
                domain: 'programming',
                specificTask: 'help with code development, debugging, and best practices',
                expertiseLevel: 'expert',
                style: 'professional and educational',
                requirements: ['Provide clear code examples', 'Explain best practices', 'Include error handling suggestions'],
                constraints: ['Always prioritize code security', 'Provide explanations for complex concepts'],
                additionalSkills: ['Multiple programming languages', 'Software architecture', 'Debugging techniques']
            },
            writing: {
                roleType: 'assistant',
                domain: 'writing',
                specificTask: 'help with content creation, editing, and style improvement',
                expertiseLevel: 'expert',
                style: 'professional and educational',
                requirements: ['Improve writing clarity', 'Suggest structure improvements', 'Provide style guidance'],
                constraints: ['Preserve author voice', 'Maintain appropriate tone'],
                additionalSkills: ['Content writing', 'Grammar and style', 'Audience adaptation']
            },
            analysis: {
                roleType: 'assistant',
                domain: 'analysis',
                specificTask: 'help with data interpretation, visualization, and insights',
                expertiseLevel: 'expert',
                style: 'professional and analytical',
                requirements: ['Provide clear insights', 'Suggest visualizations', 'Explain statistical concepts'],
                constraints: ['Consider data limitations', 'Provide context for findings'],
                additionalSkills: ['Statistical analysis', 'Data visualization', 'Business intelligence']
            },
            research: {
                roleType: 'assistant',
                domain: 'research',
                specificTask: 'help with literature review, methodology, and academic writing',
                expertiseLevel: 'expert',
                style: 'academic and formal',
                requirements: ['Follow academic standards', 'Provide citation suggestions', 'Help with structure'],
                constraints: ['Maintain academic rigor', 'Use appropriate citations'],
                additionalSkills: ['Research methodology', 'Academic writing', 'Literature review']
            }
        };

        const template = templates[templateType];
        if (template) {
            this.fillFormWithTemplate(template);
            // Switch to generator tab
            document.querySelector('[data-tab="generator"]').click();
        }
    }

    fillFormWithTemplate(template) {
        document.getElementById('roleType').value = template.roleType;
        document.getElementById('domain').value = template.domain;
        document.getElementById('specificTask').value = template.specificTask;
        document.getElementById('expertiseLevel').value = template.expertiseLevel;
        document.getElementById('style').value = template.style;
        document.getElementById('requirements').value = template.requirements.join('\n');
        document.getElementById('constraints').value = template.constraints.join('\n');
        document.getElementById('additionalSkills').value = template.additionalSkills.join('\n');
    }

    clearPromptForm() {
        document.getElementById('promptForm').reset();
        document.getElementById('generatorResult').style.display = 'none';
    }

    copyPrompt() {
        const promptText = document.getElementById('promptOutput').textContent;
        navigator.clipboard.writeText(promptText).then(() => {
            this.showToast('Prompt copied to clipboard!', 'success');
        }).catch(() => {
            this.showToast('Failed to copy prompt', 'error');
        });
    }

    downloadPrompt() {
        const promptText = document.getElementById('promptOutput').textContent;
        const blob = new Blob([promptText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'langgpt-prompt.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast('Prompt downloaded!', 'success');
    }

    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new LangGPTPromptAssistant();
}); 