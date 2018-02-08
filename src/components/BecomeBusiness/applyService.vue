<template>
	<div class="content">
		<component :is="indexPage"></component>
	</div>

</template>

<script>
import Lib from 'assets/js/Lib.js'
import agreement from 'components/BecomeBusiness/BusinessAgreement.vue'
import apply from 'components/BecomeBusiness/BusinessbackApply.vue'

  export default {

    data() {
      return {
        indexPage:'agreement'
      }
    },
    components: {
    	agreement,apply
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>