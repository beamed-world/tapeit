'use strict'

import { join, basename } from 'path'
import * as fs from 'fs'

type Content = string

type FileName =
  string

type DirTree =
  File | Dir

type Kind = 'directory' | 'file'

type File =
  {
    name: FileName
    , content: Content
    , kind: Kind
  }

type Dir =
  {
    name: FileName
    , content: DirTree[]
    , kind: Kind
  }


/**
 * Takes a string to a file or folder, creates a DirTree,
 * and then writes that to the file specified by the second
 * argument
 * 
 * @export
 * @param {string} path The input file or directory
 * @param {string} output The output file to write to
 * @returns Promise<void>
 */
export async function writeDirTree(path: string, output: string): Promise<void> {

  const dirTree = await createDirTree(path)
  let data = JSON.stringify(dirTree)

  if (path[0] === '/') {

    const pathRemove = path.replace(basename(path), '')

    const normalizedDirTree = normalizeDirTree(dirTree, pathRemove)
    data = JSON.stringify(normalizedDirTree)

  }

  return new Promise<void>((resolve, reject) => {

    fs.writeFile(output, data, error => {
      if (error) {
        reject(error)
      }
      resolve()
    })

  })

}

/**
 * Takes a DirTree and removes excess path, for example when
 * you pass an absolute path, this will removes the /../../../
 * 
 * @export
 * @param {DirTree} dirTree
 * @param {string} path
 * @returns {DirTree}
 */
export function normalizeDirTree(dirTree: DirTree, path: string): DirTree {

  dirTree.name = dirTree.name.replace(path, '')

  if (dirTree.kind === 'file') {
    return dirTree
  } else if (Array.isArray(dirTree.content)) {
    const content = dirTree.content as any[]
    const subPath = join(path, dirTree.name, '/')
    dirTree.content = content.map(subTree => normalizeDirTree(subTree, subPath))
    return dirTree
  }

}


/**
 * Takes a path to a directory and returns on object
 * representing that directory
 * 
 * @export
 * @param {string} path
 * @returns {Promise<DirTree>}
 */
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
    const dirTree: DirTree = { name: path, content, kind: 'file' }

    return dirTree

  }

}

/**
 * Helper function to avoid
 * join(__dirname, ...)
 * 
 * @param {...string[]} paths
 * @returns
 */
function jd(...paths: string[]): string {
  return join(__dirname, ...paths)
}

/**
 * Reads the files at the specified path and resolves
 * with a base 64 encoding of its contents
 * 
 * @param {string} filename
 * @returns {Promise<string>}
 */
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

async function exists(path: string): Promise<boolean> {

  return new Promise<boolean>((resolve, reject) => {

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