# Vite + Vue Chrome Extension Template

## Build Setup

```bash
# install dependencies
$ pnpm i

# build in development mode
$ pnpm dev

# build in production mode
$ pnpm build
```

## Setting

You can modify the "output" object in [manifest.mjs](./manifest.mjs) to control the bundle

```javascript
export const output = {
  background: true, // service worker
  content: true, // content scripts
  popup: true, // popup page
  options: true, // options page
  override: true // override newtab or history or bookmarks page
}
```

## Testing locally on Chrome

1. Go to chrome://extensions/ page
2. Toggle Developer mode ON
3. Select Load Unpacked
4. Select the /dist directory
