const AdmZip = require('adm-zip')
const path = require('path')

const zip = new AdmZip()

zip.addLocalFolder('./src')

const outputPath = path.resolve(__dirname, 'extension.zip')
zip.writeZip(outputPath)

console.log('✅ extension.zip created successfully!')
console.log('Upload to https://chrome.google.com/webstore/devconsole/ now!')
