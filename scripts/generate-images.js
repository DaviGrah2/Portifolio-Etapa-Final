const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Folders (public so Vite serves them statically)
const INPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'originals')
const WEBP_DIR = path.join(__dirname, '..', 'public', 'assets', 'webp')
const PLACEHOLDER_FILE = path.join(__dirname, '..', 'public', 'assets', 'placeholders.json')

if (!fs.existsSync(INPUT_DIR)) {
  console.error('Input folder not found:', INPUT_DIR)
  console.error('Create the folder and add images: public/assets/originals/*.jpg|png')
  process.exit(1)
}

if (!fs.existsSync(WEBP_DIR)) fs.mkdirSync(WEBP_DIR, { recursive: true })

const files = fs.readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f))

const placeholders = {}

async function processFile(file){
  const inPath = path.join(INPUT_DIR, file)
  const name = path.parse(file).name
  const outWebp = path.join(WEBP_DIR, name + '.webp')

  console.log('Processing', file)

  try{
    // convert to webp
    await sharp(inPath).webp({ quality: 78 }).toFile(outWebp)

    // create tiny blurred placeholder (20px wide)
    const buf = await sharp(inPath).resize(20).blur().toBuffer()
    const mime = 'image/jpeg'
    const base64 = `data:${mime};base64,` + buf.toString('base64')
    placeholders[file] = base64
  }catch(err){
    console.error('Error processing', file, err)
  }
}

;(async ()=>{
  for (const f of files) await processFile(f)
  fs.writeFileSync(PLACEHOLDER_FILE, JSON.stringify(placeholders, null, 2))
  console.log('Done. WebP files in:', WEBP_DIR)
  console.log('Placeholders written to:', PLACEHOLDER_FILE)
})()
