const fs = require('fs')
const got = require('got')
const core = require('@actions/core')
const glob = require('@actions/glob');
const github = require('@actions/github')
const { createCommentMarkdown } = require('./create-comment')

async function run() {
	
	const patterns = ['**/css', '**/*.css']
	const globber = await glob.create(patterns.join('\n'))
	
	//const globber = await glob.create(core.getInput('path'), { followSymbolicLinks: false })
	const files = await globber.glob()
	console.log(`Found ${files.length} files to upload`)
	console.log(`First file is ${files[0]}`)
	//const cssPath = core.getInput('css-path')
	//console.log(cssPath)
	echo "::debug::Set the Octocat variable"
	core.debug("test")
	//core.debug(cssPath)

	const webhookToken = core.getInput('project-wallace-token')
	console.log(webhookToken)

	const githubToken = core.getInput('github-token')
	console.log(githubToken)

	const shouldPostPrComment = core.getInput('post-pr-comment') === 'true'
	const { eventName, payload } = github.context
	console.log(eventName)

	//if (eventName !== 'pull_request') {
	//	console.log("finish early")
	//	return
	//}

	// Read CSS file
	console.log("read css file")
	//var cssFiles = fs.readdirSync(cssPath).filter(fn => fn.endsWith('.css'));
	//console.log(cssFiles)
	//console.log(cssFiles[0])
	try {
		const css = fs.readFileSync(files[0], 'utf8')

		// POST CSS to projectwallace.com to get the diff
		const response = await got(
			`https://www.projectwallace.com/webhooks/v2/imports/preview?token=${webhookToken}`,
			{
				method: 'post',
				headers: {
					'Content-Type': 'text/css',
					Accept: 'application/json',
				},
				body: css,
			}
		).catch((error) => {
			core.setFailed(`Could not retrieve diff from projectwallace.com`)
			throw error
		})
		const { diff } = JSON.parse(response.body)
		console.log(JSON.stringify(diff, null, 2))

		if (!shouldPostPrComment) return

		// POST the actual PR comment
		const formattedBody = createCommentMarkdown({ changes: diff })
		const owner = payload.repository.owner.login
		const repo = payload.repository.name
		const issue_number = payload.number

		const octokit = new github.GitHub(githubToken)
		await octokit.issues
			.createComment({
				owner,
				repo,
				issue_number,
				body: formattedBody,
			})
			.catch((error) => {
				core.warning(`Error ${error}: Failed to post comment to PR`)
				throw error
			})
	} catch (error) {
		core.debug('Debug2')
		core.setFailed(error.message)
	}
core.debug('Debug3')
}

run()
