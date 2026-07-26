import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcImage  = join(__dirname, 'public', 'appstore-images', 'android', 'launchericon-512x512.png')
const outDir    = join(__dirname, 'public', 'icons')

mkdirSync(outDir, { recursive: true })

const icons = [
  { name: 'icon-72x72.png',        size: 72  },
  { name: 'icon-96x96.png',        size: 96  },
  { name: 'icon-128x128.png',      size: 128 },
  { name: 'icon-144x144.png',      size: 144 },
  { name: 'icon-152x152.png',      size: 152 },
  { name: 'icon-180x180.png',      size: 180 },
  { name: 'icon-192x192.png',      size: 192 },
  { name: 'icon-384x384.png',      size: 384 },
  { name: 'icon-512x512.png',      size: 512 },
  { name: 'icon-maskable-192.png', size: 192 },
  { name: 'icon-maskable-512.png', size: 512 },
]

for (const { name, size } of icons) {
  await sharp(srcImage)
    .resize(size, size)
    .png()
    .toFile(join(outDir, name))
  console.log(`✅ Generated ${name}`)
}

// apple-touch-icon (180x180) in public root
await sharp(srcImage).resize(180, 180).png().toFile(join(__dirname, 'public', 'apple-touch-icon.png'))
console.log('✅ Generated apple-touch-icon.png')

// favicon.ico
await sharp(srcImage).resize(32, 32).png().toFile(join(__dirname, 'public', 'favicon.ico'))
console.log('✅ Generated favicon.ico')

console.log('\n🎉 All PWA icons generated successfully!')
