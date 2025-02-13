'use strict'
const log = require('logger')
const imagesToIgnore = require('./imagesToIgnore.json')
const getImage = require('./getImage')
const saveImage = require('./saveImage')

let ignoreImages = new Set(imagesToIgnore || [])

module.exports = async( data = {})=>{
  if(!data.img) return
  log.debug(`started proccessing ${data.dir}/${data.img}....`)
  if(ignoreImages?.has(data.img) || data.img.startsWith('icon_stat_')) return;
  if(!data.base64Img) data.base64Img = await getImage(data.img, data.assetVersion)
  if(!data.base64Img) return
  console.log(data.base64Img)
  let status = await saveImage(data)
  if(status) log.debug(`saved ${data.img} to ${data.dir}...`)
  return status
}
