# Paper Wysiwyg

A minimalistic yet powerful WYSIWYG, built on TipTap and inspired by Outline wiki

## Usage

### In a component.
```javascript
<template>
  <paper-wysiwyg v-model="content"></paper-wysiwyg>
</template>
<script>
  import PaperWysiwyg from "@jez500/paper-wysiwyg"

  export default {
    components: { PaperWysiwyg },
    data() {
      return {
        content: '<p>Hello world</p>',
      }
   }
}
</script>
```

## Building

### Docker

If node is not installed but docker is, just use the helper scripts to run npm.

#### Build package (dist)
```bash
./node-docker.sh npm run build
```

#### Build demo
```bash
./node-docker.sh npm run build:demo
```