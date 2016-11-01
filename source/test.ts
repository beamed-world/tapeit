'use strict'

import * as Ajv from 'ajv'
import * as fs from 'fs'
import { join } from 'path'
import * as assert from 'assert'

// Local imports

import * as tapeit from './index'

describe('tapeit', () => {

  it('should have a test', () => {
    assert(true, 'It does have a test!')
  })

  it('should have a createDirTree function', () => {
    assert(typeof tapeit.createDirTree === 'function')
  })

  it('should have a writeDirTree function', () => {
    assert(typeof tapeit.writeDirTree === 'function')
  })

  it('should have a normalizeDirTree function', () => {
    assert(typeof tapeit.normalizeDirTree === 'function')
  })

  const inputFolder = join(__dirname, '../resources/test-folder')
  const outputFile = join(__dirname, '../resources/test-folder.dir.json')

  it('should write a dir', done => {

    fs.unlinkSync(outputFile)

    tapeit.writeDirTree(inputFolder, outputFile)
      .then(() => {
        assert(true)
        done()
      })
      .catch(error => {
        assert(false)
        console.log(error)
      })

  })

  it('should have written a dir', () => {

    const stats = fs.statSync(outputFile)

    assert(stats.isFile())

  })

  let parsed = null

  it('should be valid json', () => {

    try {
      const file = fs.readFileSync(outputFile)
      parsed = JSON.parse(file.toString())
      assert(true)
    } catch (error) {
      assert(false, error)
    }

  })

  it('should conform to the JSON schema', () => {

    if (parsed === null) {
      return
    }

    const schema = JSON.parse(fs.readFileSync(join(__dirname, '../json-tape.schema.json')).toString())
    const ajv = new Ajv()
    const valid = ajv.validate(schema, parsed)

    if (!valid) {
      assert(false, ajv.errorsText())
    }

    assert(true)

  })

})
