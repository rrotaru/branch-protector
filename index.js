const BranchProtector = require('./lib/BranchProtector')

/**
 * This is the main entrypoint to the Probot app
 * @param {import('probot').Application} 
 */

module.exports = app => {
    const handler = new BranchProtector(app)

    // Listen for new repository event and trigger setup of branch protection rules
    app.on('repository.created', async (context) => handler.setupNewRepo(context))
}