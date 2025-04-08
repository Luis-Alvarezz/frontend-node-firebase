<template>
  <v-card class="mx-auto" max-width="400">
    <v-card-title class="text-h5">
      Iniciar Sesión
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="user.usuario"
          label="Usuario"
          required
        />
        <v-text-field
          v-model="user.password"
          label="Password"
          type="password"
          required
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="primary" @click="login">
        Ingresar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      user: {
        usuario: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$auth.loginWith('local', {
          data: this.user
        })
        // console.log('Usuario Autenticado: ', this.$auth.user)
        // this.$router.push('/principal')
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Ocurrio un error al tratar de ingresar'
        this.$store.dispatch('alert/triggerAlert', { // ? Payload:
          message: errorMessage,
          type: 'error'
        })
      }
    }
  }
}
</script>
