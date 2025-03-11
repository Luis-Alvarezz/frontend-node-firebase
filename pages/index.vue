<template>
  <v-container>
    <loginUser />
  </v-container>
</template>

<script>
import loginUser from '~/components/auth/loginUser.vue'
export default {
  name: 'IndexPage',
  components: {
    loginUser
  }
}
</script>
