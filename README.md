# Paper Wysiwyg

A minimalistic yet powerful [VueJS 2](https://vuejs.org/) WYSIWYG, built on [TipTap 2](https://tiptap.dev/) 
and inspired by [Outline wiki](https://www.getoutline.com/)

## Install

```bash
npm install @jez500/paper-wysiwyg
```

## Dependencies

* VueJS 2.X 
* Axios (for image uploads) `@todo make optional`

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
./node-docker.sh npm run build && ./node-docker.sh npm run build:demo
```

## Image uploads

To enable uploads, you just have to add a `upload-url` prop. Eg

```javascript
   <paper-wysiwyg upload-url="/post/backend/route"></paper-wysiwyg>
```

The upload route should return JSON array of saved file paths. 

### Once uploading is enabled, you can

* Drag and drop an image
* Paste an image from the clipboard
* Click **+** and browse for an image

### Example of a basic laravel backend route

```php
<?php
Route::post('/upload/image', function(Request $request) {
    $files = [];
    
    if ($request->hasFile('images')) {
        $uploadedFiles = $request->file('images');
      
        foreach ($uploadedFiles as $file) {
            if (! $file->isValid()) {
              continue;
            }
            
            $name = uniqid().'_'.trim($file->getClientOriginalName());           
            $file->move(Storage::path('public/'.$path), $name);            
            $files[] = Storage::url($path.'/'.$name);
        }
    }
    
    return $files;
});
```