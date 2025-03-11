'use strict'
const log = require('logger')
const Cmds = require('src/cmds')
const sleep = (ms = 5000)=>{ return new Promise(resolve=>{setTimeout(resolve, ms)})}
module.exports = async(data = {})=>{
  try{
      if(!data?.cmd) return
      log.debug(`${data?.cmd} processing started...`)
      let status = await Cmds[data.cmd](data)
      log.debug(`${data?.cmd} processing done...`)
      await sleep(500)
      if(!status) return 1
    }catch(e){
      log.error(e)
      return 1
    }
}
