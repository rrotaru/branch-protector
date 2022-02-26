const configFile = 'protector.yml'
const yaml = require('js-yaml')

class BranchProtector {
    /**
     * Initialize Probot
     * 
     * @constructor
     * @param robot
     */
    constructor(robot) {
        this.robot = robot
    }

    /**
     * Process new repository creation
     * 
     * @param context
     * @returns {Promise<void>}
     */
    async setupNewRepo(context) {
        this.robot.log.debug(`New repository: ${context.payload.repository.name}`)

        await this.setBranchProtection(context)
        await this.openIssue(context)
    }

    /**
     * Set branch protection rules
     * 
     * @param context
     * @returns {Promise<void>}
     */
    async setBranchProtection(context) {
        this.robot.log.debug('Setting branch protection rules')

        const rules = context.repo({
            "branch": context.payload.repository.default_branch,
            "required_status_checks": null,
            "enforce_admins": null,
            "restrictions": null,
            "required_pull_request_reviews": {
                "required_approving_review_count": 1
            }
        })
        
        await context.octokit.rest.repos.updateBranchProtection(rules)
    }

    /**
     * Open new issue with protection info
     * 
     * @param context
     * @returns {Promise<void>}
     */
     async openIssue(context) {
        this.robot.log.debug('Creating new issue')

        const issue = context.issue({
            title: 'Branch Protection Rules', 
            body: `Hi @${context.payload.sender.login}! :wave:\n\n`
                + `As a heads up, we've set up branch protection rules on this repository. :tada:\n`
                + `Head over to the [settings page here](${context.payload.repository.html_url}/settings/branches) to find out more.`
        })
        
        await context.octokit.rest.issues.create(issue)
    }
}

module.exports = BranchProtector