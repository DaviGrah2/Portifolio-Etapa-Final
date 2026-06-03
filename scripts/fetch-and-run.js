const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const { execSync } = require('child_process')

const PROJECTS_FILE = path.join(__dirname, '..', 'src', 'data', 'projects.js')
const ORIGINALS_DIR = path.join(__dirname, '..', 'public', 'assets', 'originals')
if (!fs.existsSync(ORIGINALS_DIR)) fs.mkdirSync(ORIGINALS_DIR, { recursive: true })

let projects = []
try{
  projects = require(PROJECTS_FILE).default || require(PROJECTS_FILE)
}catch(e){
  console.error('Failed to require projects.js', e)
  process.exit(1)
}

function filenameFromUrl(url){
  if(!url) return ''
  try{
    const parts = url.split('/')
    return parts[parts.length - 1].split('?')[0]
  }catch(e){ return '' }
}

function download(url, dest){
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http
    const req = proto.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // redirect
        return resolve(download(res.headers.location, dest))
      }
      if (res.statusCode !== 200) return reject(new Error('Status ' + res.statusCode))
      const file = fs.createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve(dest)))
    })
    req.on('error', reject)
  })
}

(async ()=>{
  const urls = projects.map(p => p.thumbnail).filter(Boolean)
  let downloaded = 0
  for (const url of urls){
    if (url.startsWith('data:') || url.startsWith('/')) continue
    const name = filenameFromUrl(url)
    if (!name) continue
    const dest = path.join(ORIGINALS_DIR, name)
    if (fs.existsSync(dest)) {
      console.log('Already downloaded:', name)
      continue
    }
    try{
      console.log('Downloading', url)
      await download(url, dest)
      console.log('Saved to', dest)
      downloaded++
    }catch(e){
      console.warn('Failed to download', url, e.message)
    }
  }

  if (downloaded === 0) console.log('No new images downloaded or none to download.')

  // run generator and applier
  try{
    console.log('Running image generator...')
    execSync('node scripts/generate-images.js', { stdio: 'inherit' })
    console.log('Applying placeholders to projects...')
    execSync('node scripts/apply-placeholders.js', { stdio: 'inherit' })
  }catch(e){
    console.error('Error during processing:', e.message)
    process.exit(1)
  }

  console.log('Done.')
})()
