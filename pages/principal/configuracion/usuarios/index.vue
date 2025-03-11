<template>
  <v-container>
    <h1 class="text-4 mb-4">
      Gestión de Usuarios
    </h1>
    <!-- Renglon con el boton crear nuevo usuario -->
    <v-row align="center" justify="end">
      <v-btn color="primary" @click="openDialog('create')">
        <v-icon left>
          mdi-account-plus
        </v-icon>
        Crear Usuario
      </v-btn>
    </v-row>
    <!-- Tabla de los Usuarios: -->
    <v-data-table
      :headers="headers"
      :items="usuarios"
      :item-per-page="10"
      dense
      class="mt-4"
    >
      <template #[`item.acciones`]="{ item }">
        <!-- Editar: -->
        <v-icon small color="primary" title="Editar" @click="openDialog('edit', item)">
          mdi-pencil
        </v-icon>
        <!-- Borrar: -->
        <v-icon small color="red" title="Borrar" @click="openDialog('delete', item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>

    <!-- Dialogo para crear o editar un usuario: -->
    <v-dialog v-model="dialog" persistent max-width="700px">
      <v-card color="#656565">
        <v-card-title>
          <span class="text-h6">
            {{ dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario' }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-row>
              <v-col cols="4">
                <v-text-field v-model="userData.nombre" label="Nombre" required />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="userData.apaterno" label="A. Paterno" required />
              </v-col>
              <v-col cols="4">
                <v-text-field v-model="userData.amaterno" label="A. Materno" required />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="userData.direccion" label="Direccion" required />
              </v-col>
              <v-row>
                <v-col cols="4">
                  <v-text-field v-model="userData.telefono" label="Telefono" required />
                </v-col>
                <v-col cols="4">
                  <v-select
                    id="estado"
                    v-model="userData.estado"
                    :items="estados"
                    label="Estado"
                    required
                    @change="cargarMunicipios"
                  />
                  <!-- <v-text-field v-model="userData.ciudad" label="Ciudad" required />
                   -->
                </v-col>
                <v-col cols="4">
                  <!-- <v-text-field v-model="userData.estado" label="Estado" required /> -->
                  <v-select
                    id="ciudad"
                    v-model="userData.ciudad"
                    :items="ciudad"
                    label="Ciudad"
                    required
                    @change="cargarMunicipios"
                  />
                  <!-- <option v-for="estado in estados" :key="estado" value="estado">
                    {{ estado }}
                  </option> -->
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="userData.usuario" label="Usuario" required />
                </v-col>
                <v-col cols="4">
                  <v-text-field v-model="userData.password" label="Password" required type="password" />
                </v-col>
                <v-col cols="4">
                  <v-select v-model="userData.rol" :items="roles" label="Rol" required />
                </v-col>
              </v-row>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">
            Cancelar
          </v-btn>
          <v-btn :disabled="!valid" @click="saveUser">
            {{ dialogMode === 'create' ? 'Crear Usuario': 'Actualizar Usuario' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- E L I M I N A R  U S U A R I O  C U A D R O  O  D I A L O G O -->
    <v-dialog v-model="confirmDialog" persistent max-width="400px">
      <v-card color="#62717F">
        <v-card-title class="text-h6">
          Confirmación de Eliminación
        </v-card-title>
        <v-card-text>
          <template v-if="selectedUser">
            ¿Estás seguro que deseas eliminar el usuario? <strong>{{ selectedUser.nombre }}</strong>
          </template>
          <template v-else>
            Cargando Datos del Usuario...
          </template>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeConfirmDialog">
            Cancelar
          </v-btn>
          <v-btn text color="red" :disabled="!selectedUser" @click="deleteUser">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { estadosMunicipios } from '~/static/estadosMunicipios'
export default {
  layout: 'principal',
  middleware: 'auth',

  data () {
    return {
      // ! Para municipios conforme su estado
      estados: Object.keys(estadosMunicipios),
      // * Para guardar todos los usuarios traidos de la DB
      usuarios: [],
      headers: [
        { text: 'Nombre', value: 'nombre' },
        { text: 'A. Paterno', value: 'apaterno' },
        { text: 'A. Materno', value: 'amaterno' },
        { text: 'Usuario', value: 'usuario' },
        { text: 'Rol', value: 'rol' },
        { text: 'Acciones', value: 'acciones', soportable: false }
      ],
      roles: ['admin', 'coordinador', 'recursos', 'contabilidad'],
      valid: false,
      dialog: false,
      confirmDialog: false,
      dialogMode: 'create', // ? create - edit
      userData: {
        nombre: '',
        apaterno: '',
        amaterno: '',
        direccion: '',
        telefono: '',
        ciudad: '',
        estado: '',
        usuario: '',
        password: '',
        rol: 'contabilidad'
      },
      selectedUser: null
    }
  },
  mounted () {
    this.fetchUsers()
  },
  methods: {
    cargarMunicipios () {
      if (this.userData && estadosMunicipios[this.userData.estado]) { // UserioSelecciono: Guanajuato && estadoMunicipio{Guanajuato}
        this.ciudad = estadosMunicipios[this.userData.estado] // * Almacena los municipios del Objeto con key = seleccionEstado
      } else {
        this.ciudad = []
      }
      this.userData.municipio = ''
    },
    async fetchUsers () {
      try {
        const response = await this.$axios.get('/users')
        // console.log('Respuesta de indexUsuarios: ', response)
        this.usuarios = response.data
        // console.log(this.usuarios)
      } catch (error) {
        const errorMessage = error.message || 'Ocurrio un error al tratar obtener usuarios'
        this.$store.dispatch('alert/triggerAlert', { // ? Payload: | se pone dispatch porque está en el Store
          message: errorMessage,
          type: 'error'
        })
      }
    },
    openDialog (mode, user = null) {
      this.dialogMode = mode
      if (mode === 'edit' && user) {
        this.dialog = true
        user.password = ''
        this.userData = { ...user }
      } else if (mode === 'create') {
        this.dialog = true
        this.userData = {
          nombre: '',
          apaterno: '',
          amaterno: '',
          direccion: '',
          telefono: '',
          ciudad: '',
          estado: '',
          usuario: '',
          password: '',
          rol: 'contabilidad'
        }
      } else if (mode === 'delete' && user) {
        this.selectedUser = user
        this.confirmDialog = true
      }
    },
    closeDialog () {
      this.dialog = false
    },
    closeConfirmDialog () {
      this.confirmDialog = false
      this.selectedUser = null
    },
    saveUser () {
      // ! 1. Definir que funcion voy a usar:
      if (this.dialogMode === 'create') {
        this.createUser()
      } else {
        this.updateUser()
      }
    },
    async createUser () {
      try {
        // console.log(this.userData)
        await this.$axios.post('/users/create', this.userData)
        this.$store.dispatch('alert/triggerAlert', { // ? Payload: | se pone dispatch porque está en el Store
          message: 'Usuario creado con éxito',
          type: 'success'
        })
        this.fetchUsers() // * Para que se vuelva a mandar a cargar la pagina
        this.closeDialog() // * Cerramos ventaja despues
      } catch (error) {
        const errorMessage = error.message || 'Ocurrio un error al crear un usuario'
        this.$store.dispatch('alert/triggerAlert', { // ? Payload: | se pone dispatch porque está en el Store
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async updateUser () {
      try {
        await this.$axios.put(`/users/update/${this.userData.id}`, this.userData)
        // console.log('Usuario id: ', this.userData.id)
        this.fetchUsers()
        this.closeDialog()
        this.$store.dispatch('alert/triggerAlert', {
          message: 'usuario actualizado con exito',
          type: 'success'
        })
      } catch (error) {
        const errorMessage = error.message || 'Ocurrio un error al actualizar un usuario'
        this.$store.dispatch('alert/triggerAlert', { // ? Payload: | se pone dispatch porque está en el Store
          message: errorMessage,
          type: 'error'
        })
      }
    },
    async deleteUser () {
      try {
        await this.$axios.delete(`/users/delete/${this.selectedUser.id}`)
        this.$store.dispatch('alert/triggerAlert', {
          message: 'usuario borrado con éxito',
          type: 'success'
        })
        this.fetchUsers()
        this.closeConfirmDialog()
      } catch (error) {
        const errorMessage = error.message || 'Error al borrar usuario'
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
