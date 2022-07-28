# Paper Wysiwyg

A minimalistic yet powerful [VueJS 2](https://vuejs.org/) WYSIWYG, built on [TipTap 2](https://tiptap.dev/) 
and inspired by [Outline wiki](https://www.getoutline.com/)

## Install

```bash
npm install @jez500/paper-wysiwyg
```

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

#### Install dependencies
```bash
./node-docker.sh npm install
```

#### Build package (dist)
```bash
./node-docker.sh npm run build
```

#### Build demo
```bash
./node-docker.sh npm run build \
  && ./node-docker.sh npm run build:demo
```