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
	
	} catch (error) {
		core.debug('Debug2')
		core.setFailed(error.message)
	}
core.debug('Debug3')
}

run()
