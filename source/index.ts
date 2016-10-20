'use strict'

import { join, basename } from 'path'
import * as fs from 'fs'

type FileName =
  string

type DirTree =
  File | Dir

type File =
  {
    name: FileName
    , content: string
    , kind: string
  }

type Dir =
  {
    name: FileName
    , content: DirTree[]
    , kind: string
  }

export function jd(...paths: string[]) {
  return join(__dirname, ...paths)
}

export async function writeDirTree(path: string, output: string) {

  const dirTree = await createDirTree(path)
  let data = JSON.stringify(dirTree)

  if (path[0] === '/') {

    const pathRemove = path.replace(basename(path), '')

    console.log('pathRemove', pathRemove)

    const normalizedDirTree = normalizeDirTree(dirTree, pathRemove)
    data = JSON.stringify(normalizedDirTree)

  }

  return new Promise((resolve, reject) => {

    fs.writeFile(output, data, error => {
      if (error) {
        reject(error)
      }
      resolve()
    })

  })

}

export function normalizeDirTree(dirTree: DirTree, path: string): DirTree {

  dirTree.name = dirTree.name.replace(path, '')

  if (dirTree.kind === 'file') {
    return dirTree
  } else if (Array.isArray(dirTree.content)) {
    const content = dirTree.content as any[]
    dirTree.content = content.map(subTree => normalizeDirTree(subTree, path))
    return dirTree
  }

}

export async function createDirTree(path: string): Promise<DirTree> {

  const doesExist = await exists(path)

  if (!doesExist) {
    throw new Error(`${path} does not exist`)
  }

  const
    [isADirectory, isAFile] =
      [await isDirectory(path), await isFile(path)]

  if (isADirectory) {

    const filenames = await readDirectory(path)
    const content = []
    const dirTree: DirTree = { name: path, content, kind: 'directory' }

    for (const filename of filenames) {
      const file = await createDirTree(filename)
      content.push(file)
    }

    return dirTree

  } else if (isAFile) {

    const content = await readFile(path)

    return { name: path, content, kind: 'file' }

  }

}

async function readFile(filename: string): Promise<string> {

  return new Promise<string>((resolve, reject) => {

    fs.readFile(filename, (error, data) => {

      if (error) {
        reject(error)
      }

      resolve(data.toString('base64'))

    })

  })

}

async function readDirectory(directory: string): Promise<string[]> {

  return new Promise<string[]>((resolve, reject) => {

    fs.readdir(directory, (error, files) => {

      if (error) {
        reject(error)
      }

      resolve(files.map(file => join(directory, file)))

    })

  })

}

async function isDirectory(path: string): Promise<boolean> {

  return new Promise<boolean>((resolve, reject) => {

    fs.stat(path, (error, stats) => {

      if (error) {
        reject(error)
      }

      resolve(stats.isDirectory())

    })

  })

}

async function isFile(path: string): Promise<boolean> {

  return new Promise<boolean>((resolve, reject) => {

    fs.stat(path, (error, stats) => {

      if (error) {
        reject(error)
      }

      resolve(stats.isFile())

    })

  })

}

async function exists(path: string) {

  return new Promise((resolve, reject) => {

    fs.stat(path, (error, stats) => {

      if (error === null) {
        resolve(true)
      } else if (error.code === 'ENOENT') {
        resolve(false)
      } else {
        reject(error)
      }

    })

  })

}