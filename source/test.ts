'use strict'

import * as Ajv from 'ajv'
import * as fs from 'fs'
import { join } from 'path'

// Local imports

import * as tapeit from './index'

test_()

async function test_() {

  const inputFolder = join(__dirname, '../resources/test-folder')
  const outputFile = join(__dirname, '../resources/test-folder.dir.json')
  tapeit.writeDirTree(inputFolder, outputFile)
    .then(() => {
      console.log('success')
    })
    .catch(error => {
      console.log(error)
    })

}

async function test() {

  const inputFolder = join(__dirname, '../resources/test-folder')
  const outputFile = join(__dirname, '../resources/test-folder.dir.json')
  const dirTree = await tapeit.createDirTree(inputFolder)
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