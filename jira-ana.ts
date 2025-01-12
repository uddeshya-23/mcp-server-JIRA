// File parser and analyzer for JIRA reports
import fs from 'fs';
import path from 'path';

class JiraReportAnalyzer {
    constructor(inputFile) {
        this.inputFile = inputFile;
        this.outputDir = path.dirname(inputFile);
    }

    async parseByType() {
        const content = await fs.promises.readFile(this.inputFile, 'utf8');
        const items = content.split('<item>').filter(item => item.trim());
        
        // Category buckets
        const categories = {
            stories: [],
            tasks: [],
            bugs: [],
            features: [],
            improvements: [],
            subtasks: []
        };
        
        // Process items
        items.forEach(item => {
            const type = this.extractField(item, 'type');
            const status = this.extractField(item, 'status');
            const priority = this.extractField(item, 'priority');
            const summary = this.extractField(item, 'summary');
            
            const processedItem = {
                type,
                status,
                priority,
                summary,
                created: this.extractField(item, 'created'),
                updated: this.extractField(item, 'updated'),
                assignee: this.extractField(item, 'assignee')
            };
            
            // Categorize
            if (type.toLowerCase().includes('story')) {
                categories.stories.push(processedItem);
            } else if (type.toLowerCase().includes('bug')) {
                categories.bugs.push(processedItem);
            } else if (type.toLowerCase().includes('feature')) {
                categories.features.push(processedItem);
            } else if (type.toLowerCase().includes('improvement')) {
                categories.improvements.push(processedItem);
            } else if (type.toLowerCase().includes('sub-task')) {
                categories.subtasks.push(processedItem);
            } else if (type.toLowerCase().includes('task')) {
                categories.tasks.push(processedItem);
            }
        });
        
        return categories;
    }
    
    async generateReports() {
        const categories = await this.parseByType();
        
        // Generate individual category files
        for (const [category, items] of Object.entries(categories)) {
            const filename = path.join(this.outputDir, `jira_${category}.json`);
            await fs.promises.writeFile(filename, JSON.stringify(items, null, 2));
        }
        
        // Generate summary report
        const summary = this.generateSummary(categories);
        await fs.promises.writeFile(
            path.join(this.outputDir, 'jira_summary.json'),
            JSON.stringify(summary, null, 2)
        );
        
        // Generate status report
        const statusReport = this.generateStatusReport(categories);
        await fs.promises.writeFile(
            path.join(this.outputDir, 'jira_status_report.json'),
            JSON.stringify(statusReport, null, 2)
        );
        
        // Generate priority report
        const priorityReport = this.generatePriorityReport(categories);
        await fs.promises.writeFile(
            path.join(this.outputDir, 'jira_priority_report.json'),
            JSON.stringify(priorityReport, null, 2)
        );
        
        return {
            summary,
            statusReport,
            priorityReport
        };
    }
    
    generateSummary(categories) {
        const summary = {
            totalItems: 0,
            byType: {},
            byStatus: {},
            byPriority: {}
        };
        
        for (const [category, items] of Object.entries(categories)) {
            summary.totalItems += items.length;
            summary.byType[category] = items.length;
            
            // Status breakdown
            items.forEach(item => {
                if (item.status) {
                    summary.byStatus[item.status] = (summary.byStatus[item.status] || 0) + 1;
                }
                if (item.priority) {
                    summary.byPriority[item.priority] = (summary.byPriority[item.priority] || 0) + 1;
                }
            });
        }
        
        return summary;
    }
    
    generateStatusReport(categories) {
        const statusReport = {
            inProgress: [],
            blocked: [],
            completed: [],
            pending: []
        };
        
        for (const items of Object.values(categories)) {
            items.forEach(item => {
                const status = item.status.toLowerCase();
                if (status.includes('progress')) {
                    statusReport.inProgress.push(item);
                } else if (status.includes('block')) {
                    statusReport.blocked.push(item);
                } else if (status.includes('done') || status.includes('complete')) {
                    statusReport.completed.push(item);
                } else {
                    statusReport.pending.push(item);
                }
            });
        }
        
        return statusReport;
    }
    
    generatePriorityReport(categories) {
        const priorityReport = {
            high: [],
            medium: [],
            low: []
        };
        
        for (const items of Object.values(categories)) {
            items.forEach(item => {
                const priority = item.priority.toLowerCase();
                if (priority.includes('high')) {
                    priorityReport.high.push(item);
                } else if (priority.includes('medium')) {
                    priorityReport.medium.push(item);
                } else {
                    priorityReport.low.push(item);
                }
            });
        }
        
        return priorityReport;
    }
    
    extractField(item, fieldName) {
        const match = item.match(new RegExp(`${fieldName}="([^"]+)"`));
        return match ? match[1] : '';
    }
}

// Usage
const analyzer = new JiraReportAnalyzer('path/to/jirareport.txt');
analyzer.generateReports().then(reports => {
    console.log('Reports generated successfully!');
}).catch(error => {
    console.error('Error generating reports:', error);
});