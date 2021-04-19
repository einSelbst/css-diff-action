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


	
	
	} catch (error) {
		core.debug('Debug2')
		core.setFailed(error.message)
	}
core.debug('Debug3')
}

run()
