'use strict'

import * as Ajv from 'ajv'
import * as fs from 'fs'
import { join } from 'path'

// Local imports

import * as tapeit from './index'

test()

async function test() {

  const dirTree = await tapeit.createDirTree(join(__dirname, '../resources/test-folder'))
  const schema = JSON.parse(fs.readFileSync(join(__dirname, '../json-tape.schema.json')).toString())
  const ajv = new Ajv()

  fs.writeFileSync('../resources/test-folder.dir.json', JSON.stringify(dirTree, null, '  '))

  const valid = ajv.validate(schema, dirTree)

  if (!valid) {
    console.log(ajv.errors)
  } else {
    console.log('Valid')
  }

}