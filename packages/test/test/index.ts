// eslint-disable-next-line @typescript-eslint/no-var-requires
import GithubRepoServiceMemory from './github-repo-service-memory'
import GithubRepoServiceRedis from './github-repo-service-redis'
import * as Express from 'express'

require("dotenv").config()

const app = Express()

app.use(Express.json())

const githubRepoServiceRedis = new GithubRepoServiceRedis()
const githubRepoServiceMemory = new GithubRepoServiceMemory()

// REDIS
app.get("/api/redis/repos/:username", async (req, res) => {
    const username = req.params.username

    const users = await githubRepoServiceRedis.findReposByUsername(username)

    res.json(users)
})

// MEMORY
app.get("/api/memory/repos/:username", async (req, res) => {
    const username = req.params.username

    const users = await githubRepoServiceMemory.findReposByUsername(username)

    res.json(users)
})

app.listen(process.env.PORT, () => {
    console.log(`HTTP server started on port ${process.env.PORT}`)
})
