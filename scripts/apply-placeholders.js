const fs = require('fs')
const path = require('path')

const PROJECTS_FILE = path.join(__dirname, '..', 'src', 'data', 'projects.js')
const PLACEHOLDER_FILE = path.join(__dirname, '..', 'public', 'assets', 'placeholders.json')
const WEBP_DIR = path.join(__dirname, '..', 'public', 'assets', 'webp')

function readJSON(file){
  try{ return JSON.parse(fs.readFileSync(file,'utf8')) }catch(e){ return {} }
}

const placeholders = fs.existsSync(PLACEHOLDER_FILE) ? readJSON(PLACEHOLDER_FILE) : {}
const webpFiles = fs.existsSync(WEBP_DIR) ? fs.readdirSync(WEBP_DIR).filter(f => /\.webp$/i.test(f)) : []

let content = fs.readFileSync(PROJECTS_FILE, 'utf8')

// naive parse: require the module via eval in sandbox to get the array
let projects = []
try{
  // run in node to import the file
  projects = require(PROJECTS_FILE).default || require(PROJECTS_FILE)
}catch(e){
  console.error('Could not require projects.js — ensure it exports default array. Aborting.')
  process.exit(1)
}

function filenameFromUrl(url){
  if(!url) return ''
  if(url.startsWith('/')) return url.split('/').pop().split('?')[0]
  return url.split('/').pop().split('?')[0]
}

let changed = false
const updated = projects.map(p => {
  const fn = filenameFromUrl(p.thumbnail)
  const webpMatch = webpFiles.find(w => w.replace(/\.webp$/i,'') === fn.replace(/\.(jpg|jpeg|png)$/i,''))
  const newP = {...p}
  if(webpMatch){
    newP._oldThumbnail = p.thumbnail
    newP.thumbnail = `/assets/webp/${webpMatch}`
    changed = true
  }
  const placeholderKey = fn
  if(placeholders[placeholderKey]){
    newP.placeholder = placeholders[placeholderKey]
    changed = true
  }
  return newP
})

if(!changed){
  console.log('No updates to apply (no webp/placeholders matched).')
  process.exit(0)
}

// write backup
fs.copyFileSync(PROJECTS_FILE, PROJECTS_FILE + '.bak')

// generate new content as module.exports default
const out = 'const projects = ' + JSON.stringify(updated, null, 2) + "\n\nexport default projects\n"
fs.writeFileSync(PROJECTS_FILE, out, 'utf8')
console.log('Updated', PROJECTS_FILE, ' — backup at', PROJECTS_FILE + '.bak')
