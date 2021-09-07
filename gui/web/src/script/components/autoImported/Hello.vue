<template>
  <div class="example">Messge: {{ msg }}</div>
</template>

<script>
export default {
  props: {
            greeting: { default: "you" }
        },

   created: function () {
      console.log(this.greeting);     
   },
  data: function() {
    return {
      msg: `${this.greeting} Hello world!`
    }
  }
}
</script>
