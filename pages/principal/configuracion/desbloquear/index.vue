<template>
  <v-container>
    <h1 class="text-h4 bm.4">
      Desbloqueo de Usuarios
    </h1>

    <!-- Tabla de Usuarios BLoqueados -->
    <v-data-table
      :headers="headers"
      :items="usuariosBloqueados"
      :item-per-page="10"
      class="mt-4"
      dense
    >
      <template #[`item.acciones`]="{ item }">
        <v-btn small color="success" title="Desbloquear" @click="desbloquearUsuario(item.id)">
          <v-icon left>
            mdi-account-check
          </v-icon>
          Desbloquear
        </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  layout: 'principal',
  middleware: 'auth',
  // ! Variables que voy a utulizar:
  data () {
    return {
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'A.paterno', value: 'apaterno' },
        { text: 'A. Materno', value: 'amaterno' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Intentos', value: 'intentos' },
        { text: 'Acciones', value: 'acciones', sortable: false }
      ],
      usuariosBloqueados: []
    }
  },
  mounted () {
    this.fetchUsuariosBloqueados()
  },
  methods: {
    async fetchUsuariosBloqueados () {
      try {
        const response = await this.$axios.get('/users')
        this.usuariosBloqueados = []
        this.usuariosBloqueados = response.data.filter(user => user.bloqueado)
      } catch (error) {
        const errorMessage = error.message || 'Error al obtener los usuarios'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async desbloquearUsuario (id) {
      try {
        await this.$axios.post(`/users/unlock/${id}`)
        this.fetchUsuariosBloqueados()
        this.$store.dispatch('/alert/triggerAlert', {
          message: 'Usuario Desbloqueado con Éxito',
          type: 'success'
        })
      } catch (error) {
        const errorMessage = error.message || 'Error al obtener los usuarios'
        this.$store.dispatch('alert/triggerAlert', {
          message: errorMessage,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
