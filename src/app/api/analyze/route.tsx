// src/app/api/analyze/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { spawn } from 'child_process'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  try {
    // Parse incoming multipart form data
    const formData = await request.formData()
    const fileField = formData.get('file') as File | null
    if (!fileField) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Read file data and write to temp file
    const buffer = Buffer.from(await fileField.arrayBuffer())
    const tmpDir = os.tmpdir()
    const inputPath = path.join(tmpDir, fileField.name)
    await fs.promises.writeFile(inputPath, buffer)

    // Determine output path
    const outputPath = inputPath + '.analysis.json'

    // Compute absolute path to bundled cerberus binary
    // OLD. works on local->
    // const cerberusPath = path.join(process.cwd(), 'cerberus')
    // NEW. for vercel?
    const cerberusPath = path.join(process.cwd(), 'bin', 'cerberus')


    // Run the cerberus executable
    await new Promise<void>((resolve, reject) => {
      const child = spawn(cerberusPath, [inputPath], { stdio: 'inherit' })
      child.on('exit', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`cerberus exited with code ${code}`))
      })
    })

    // Read and parse the JSON output
    const raw = await fs.promises.readFile(outputPath, 'utf-8')
    const json = JSON.parse(raw)

    // Clean up temp files
    await fs.promises.unlink(inputPath).catch(() => {})
    await fs.promises.unlink(outputPath).catch(() => {})

    return NextResponse.json(json)
  } catch (err) {
    console.error('Analysis error:', err)
    const message = err instanceof Error ? err.message : 'Internal error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
