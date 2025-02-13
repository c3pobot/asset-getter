'use strict'
const log = require('logger')
const fetch = require('./fetch')

let GIT_USER = process.env.GIT_USERNAME, GIT_EMAIL = process.env.GIT_EMAIL, GIT_TOKEN = process.env.GIT_TOKEN

const checkRateLimit = async()=>{
  if(!GIT_TOKEN) return
  let res = await fetch('https://api.github.com/rate_limit', 'GET', null, { 'Authorization': `Bearer ${GIT_TOKEN}` })
  if(!res.rate){
    log.error('error checking git hub rate_limit...')
    return
  }
  if(res.rate.remaining > 0) return true
  log.error(`You have exceeded the git hub api rate limit rate limit will reset in ${(rate.reset * 1000 - Date.now()) / 1000} seconds`)
}

const getSha = async(repo, fileName)=>{
  if(!repo || !fileName) return
  let file = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, 'GET', null, { 'Authorization': `Bearer ${GIT_TOKEN}` })
  return file?.sha
}
const pushFile = async({ repo, fileName, data, commitMsg })=>{
  if(!repo || !fileName || !GIT_TOKEN || !data || !GIT_EMAIL || !GIT_USER) return
  let rateLimit = await checkRateLimit(token)
  if(!rateLimit) return
  let fileSha = await getSha(repo, fileName)
  let body = { committer: { name: GIT_USER, email: GIT_EMAIL }, message: commitMsg?.toString() || 'update', content: data, sha: sha }
  let status = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, 'PUT', JSON.stringify(body), { 'Authorization': `Bearer ${GIT_TOKEN}` })
  return status?.content?.sha
}

module.exports.push = async(repo, fileName, data, commitMsg)=>{
  if(!repo || !fileName || !GIT_TOKEN || !data || !GIT_EMAIL || !GIT_USER) return
  let rateLimit = await checkRateLimit()
  if(!rateLimit) return
  let fileSha = await getSha(repo, fileName)
  let body = { committer: { name: GIT_USER, email: GIT_EMAIL }, message: commitMsg?.toString() || 'update', content: data, sha: fileSha }
  let status = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, 'PUT', JSON.stringify(body), { 'Authorization': `Bearer ${GIT_TOKEN}` })
  return status?.content?.sha
}
