'use strict'
const fetch = require('node-fetch')

const AE_URI = process.env.AE_URI

const parseResponse = async(res)=>{
  if(res?.status?.toString().startsWith(4)) throw('Fetch Error')
  if(!res?.status?.toString().startsWith('2')) return
  if(res.headers?.get('Content-Disposition')?.includes('filename')){
    let buff = await res.arrayBuffer()
    return Buffer.from(buff)?.toString('base64')
  }
}
const requestWithRetry = async(uri, opts = {}, count = 0)=>{
  try{
    let res = await fetch(uri, opts)
    if(res?.error === 'FetchError'){
      if(count < retryCount){
        count++
        return await requestWithRetry(uri, opts, count)
      }else{
        throw(`tried request ${count} time(s) and errored with ${res.error} : ${res.message}`)
      }
    }
    return res
  }catch(e){
    throw(e)
  }
}
module.exports = async(assetName, version)=>{
  try{
    if(!AE_URI || !version || !assetName) return
    let uri = `${AE_URI}/Asset/single?forceReDownload=true&version=${version}&assetName=${assetName.replace('tex.', '')}&assetOS=1`
    let res = await requestWithRetry(uri, { method: 'GET', compress: true, timeout: 60000 })
    return await parseResponse(res)
  }catch(e){
    throw(e);
  }
}
