#!/usr/bin/env node

const { writeDirTree } = require('tapeit')

cmd()

function cmd() {

  const { length } = process.argv

  if (length < 3 || length > 4) {
    console.log('tapeit <input directory>')
    console.log('tapeit <input directory> <output file>')
    return
  }

  const [ , , inputFile = null, outputFile = null ] = process.argv
  const t = s => typeof s === 'string'
  const l = (i, o) => console.log(`Writing ${i} to ${o}`)

  if (t(inputFile) && t(outputFile)) {
    l(inputFile, outputFile)
    writeDirTree(inputFile, outputFile)
  } else if (t(inputFile)) {
    const autoOutput = `${inputFile}.dir.json`
    l(inputFile, autoOutput)
    writeDirTree(inputFile, autoOutput)
  }

}
