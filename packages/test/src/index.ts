require('dotenv').config()
import GithubRepoService from './github-repo-service'
import * as Express from 'express'

const app = Express()

app.use(Express.json())

const githubRepoService = new GithubRepoService()

app.get('/api/repos/:username', async (req, res) => {
    const username = req.params.username

    const users = await githubRepoService.findReposByUsername(username)

    res.json(users)
})

app.listen(process.env.PORT, () => {
    console.log(`HTTP server started on port ${process.env.PORT}`)
})
