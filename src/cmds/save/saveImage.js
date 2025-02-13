'use strict'
const log = require('logger')
const rabbitmq = require('src/rabbitmq')
const gitClient = require('src/gitClient')

const GIT_REPO = process.env.GIT_ASSET_REPO
module.exports = async({ img, base64Img, dir })=>{
  if(!GIT_REPO || !img || !base64Img || !dir) return
  log.debug(`saving ${img} to github repo....`)
  let status = await gitClient.push(GIT_REPO, `${dir}/${img}.png`, base64Img)
  if(status) status = await rabbitmq.notify({ cmd: 'saveImage', fileName: `${img}.png`, dir: dir, base64Img: base64Img, timestamp: Date.now() })
  return status
}
