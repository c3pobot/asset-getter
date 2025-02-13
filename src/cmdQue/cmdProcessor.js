'use strict'
const log = require('logger')
const Cmds = require('src/cmds')

module.exports = async(data = {})=>{
  try{
      if(!data?.cmd) return
      log.debug(`${data?.cmd} processing started...`)
      let status = await Cmds[data.cmd](data)
      log.debug(`${data?.cmd} processing done...`)
      if(!status) return 1
    }catch(e){
      log.error(e)
      return 1
    }
}
