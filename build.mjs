import fs from 'fs'
import path from 'path'
import url from 'url'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteEslint from 'vite-plugin-eslint'
import rimraf from 'rimraf'
import manifest, { output } from './manifest.mjs';

const mode = process.argv[2]
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

function crx(options = {}) {
  if (!crx.files) {
    crx.files = []
  }
  let config = null

  return {
    name: 'vite-plugin-crx',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async generateBundle(_, bundle) {
      crx.files = crx.files.concat(Object.keys(bundle))
      if (options.handleManifest) {
        if (output.background) {
          const bgJs = crx.files.filter((e) => /background\.(.*?)\.js$/.test(e))[0];
          manifest.background.service_worker = bgJs
        } else {
          delete manifest.background
        }
        if (output.content) {
          const contJs = crx.files.filter((e) => /content\.(.*?)\.js$/.test(e))[0];
          manifest.content_scripts[0].js = [contJs]
        } else {
          delete manifest.content_scripts
        }
        if (!output.popup) {
          manifest.action.default_popup = ''
        }
        if (!output.options) {
          manifest.options_page = ''
        }
        if (!output.override) {
          delete manifest.chrome_url_overrides
        }
        const dest = path.join(config.root, config.build.outDir, 'manifest.json')
        fs.writeFileSync(dest, JSON.stringify(manifest, null, 2))
      }
    }
  }
}

function cleanDist() {
  rimraf.sync(path.join(__dirname, 'dist'))
}

async function buildBackground() {
  if (!output.background) {
    return
  }

  await build({
    mode,
    plugins: [
      viteEslint({ fix: true }),
      crx()
    ],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          background: 'src/background/main.js'
        },
        output: {
          format: 'iife'
        }
      }
    }
  })
}

async function buildContent() {
  if (!output.content) {
    return
  }

  await build({
    mode,
    plugins: [
      vue(),
      viteEslint({ fix: true }),
      crx()
    ],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: {
          content: 'src/content/main.js',
        },
        output: {
          format: 'iife'
        }
      }
    }
  })
}

async function buildOthers() {
  const rollupOptionsInput = {}
  if (output.popup) {
    rollupOptionsInput.popup = manifest.action.default_popup
  }
  if (output.options) {
    rollupOptionsInput.options = manifest.options_page
  }
  if (output.override) {
    rollupOptionsInput.override = manifest.chrome_url_overrides.newtab
      || manifest.chrome_url_overrides.history
      || manifest.chrome_url_overrides.bookmarks
  }
  if (Object.keys(rollupOptionsInput).length === 0) {
    return
  }

  await build({
    mode,
    plugins: [
      vue(),
      viteEslint({ fix: true }),
      crx({ handleManifest: true })
    ],
    build: {
      emptyOutDir: false,
      rollupOptions: {
        input: rollupOptionsInput
      }
    }
  })
}

(async function() {
  await cleanDist()
  await buildBackground()
  await buildContent()
  await buildOthers()
})()
