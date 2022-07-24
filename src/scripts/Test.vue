<template>
  <div>
    <h3>Tes</h3>
    <div v-html="value" />
  </div>
</template>

<script>
export default {
  name: "paper-wysiwyg",
  props: ['value']
}
</script>

<style scoped>

</style>