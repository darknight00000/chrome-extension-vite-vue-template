import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

const name = pkg.name
  .split('-')
  .map((e) => e.slice(0, 1).toUpperCase() + e.slice(1).toLowerCase())
  .join(' ')

export const output = {
  background: true, // service worker
  content: true, // content scripts
  popup: true, // popup page
  options: true, // options page
  override: true // override newtab or history or bookmarks page
}

export default {
  name,
  version: pkg.version,
  description: '',
  manifest_version: 3,
  icons: {
    16: 'icon.png',
    48: 'icon.png',
    128: 'icon.png'
  },
  action: {
    default_icon: {
      16: 'icon.png',
      48: 'icon.png',
      128: 'icon.png'
    },
    default_title: name,
    default_popup: 'src/popup/index.html'
  },
  options_page: 'src/options/index.html',
  background: {
    service_worker: ''
  },
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: []
    }
  ],
  chrome_url_overrides: {
    newtab: 'src/override/index.html'
    // history: 'src/override/index.html'
    // bookmarks: 'src/override/index.html'
  },
  permissions: [],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+B',
        mac: 'MacCtrl+B'
      }
    }
  }
}
