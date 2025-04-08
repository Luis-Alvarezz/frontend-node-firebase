<template>
  <v-container>
    <v-row align="center" justify="end">
      <div>
        <span class="title">Lab Appointments</span>
      </div>
      <v-spacer />
      <v-text-field
        label="Search"
        append-icon="mdi-magnify"
        single-line
        hide-details
        outlined
        class="mr-4"
      />
      <v-btn class="btnFilter">
        <span>
          Filter
        </span>
        <v-icon>
          mdi-filter-outline
        </v-icon>
      </v-btn>
      <v-btn class="btnPatient" @click="dialogAddPacient = true">
        <v-icon>
          mdi-plus
        </v-icon>
        <span>
          Add Patient
        </span>
      </v-btn>
    </v-row>
    <v-row align="center" justify="start">
      <v-data-table
        class="mt-4"
      />
    </v-row>

    <v-dialog v-model="dialogAddPacient" max-width="900px" persistent>
      <v-card color="#FFFFFF" elevation="0" class="pa-2">
        <v-card-title>
          Add Patient
          <v-spacer />
          <v-btn
            icon
            class="mr-2"
            color="grey darken-1"
            @click="dialogAddPacient = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- ============ TABS DINAMICOS con ESTILOS ============ -->
          <v-tabs
            v-model="activeTab"
            background="blue lighten-4"
            background-color="#F2F3FD"
            color="#F2F3FD"
            class="border-radius-custom"
          >
            <v-tab
              v-for="tab in tabs"
              :key="tab"
              :class="{'#0E1680': activeTab === tab}"
            >
              {{ tab }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <!-- ! TAB 1.- Demographics -->
            <v-tab-item>
              <v-form style="margin-top: 10px !important;">
                <v-row>
                  <v-col cols="12">
                    <v-label>Full Name</v-label>
                    <v-text-field v-model="paciente.fullname" placeholder="Enter your full name" required outlined />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="4">
                    <v-label>Email ID</v-label>
                    <v-text-field v-model="paciente.email" placeholder="Enter your e-mail" required outlined />
                  </v-col>
                  <v-col cols="4">
                    <v-label>Mobile Number</v-label>
                    <v-text-field v-model="paciente.mobile" placeholder="Enter your mobile number" required outlined />
                  </v-col>

                  <v-col cols="4">
                    <v-label>Date of Birth</v-label>
                    <v-menu
                      ref="menu"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template #activator="{ on, attrs }">
                        <v-text-field
                          v-model="paciente.dateBirth"
                          placeholder="Enter date"
                          prepend-inner-icon="mdi-calendar"
                          required
                          readonly
                          outlined
                          v-bind="attrs"
                          v-on="on"
                        />
                      </template>
                      <v-date-picker v-model="paciente.dateBirth" @input="menu = false" />
                    </v-menu>
                  </v-col>
                  <v-col cols="6">
                    <v-label>Mother Tongue</v-label>
                    <v-text-field v-model="paciente.motherTongle" placeholder="Enter your mother tongue" required outlined />
                  </v-col>
                  <v-col cols="6">
                    <v-label>Gov ID</v-label>
                    <v-text-field v-model="paciente.govId" placeholder="Enter got id" required outlined />
                  </v-col>

                  <v-col cols="6">
                    <v-label>Sex</v-label>
                    <v-radio-group v-model="paciente.sex" row>
                      <v-radio label="Male" value="male" class="mr-4" />
                      <v-radio label="Female" value="female" class="mr-4" />
                    </v-radio-group>
                    <!-- <v-text-field v-model="paciente.sex" label="Sex" required outlined /> -->
                  </v-col>
                  <v-col cols="6">
                    <v-label>Material Status</v-label>
                    <v-radio-group v-model="paciente.maritalStatus" row>
                      <v-radio label="Single" value="single" class="mr-4" />
                      <v-radio label="Married" value="married" class="mr-4" />
                      <v-radio label="Widow" value="widow" />
                    </v-radio-group>
                    <!-- <v-text-field v-model="paciente.maritalStatus" label="Marital Status" required outlined /> -->
                  </v-col>
                </v-row>
              </v-form>
            </v-tab-item>
            <!-- ============================================================================================================================================================ -->

            <!-- TAB 2.- Address  -->
            <v-tab-item>
              <v-form style="margin: 10px !important;">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="paciente.address" label="Address" required outlined />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <v-text-field v-model="paciente.city" label="City" required outlined />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field v-model="paciente.zipCode" label="Zip Code" required outlined />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field v-model="paciente.state" label="State" required outlined />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="paciente.country" label="Country" required outlined />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="paciente.district" label="Distric" required outlined />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="paciente.international" label="International" required outlined />
                  </v-col>
                </v-row>
              </v-form>
            </v-tab-item>

            <!-- TAB 3. Photo -->
            <v-tab-item class="mb-6">
              <v-form class="mt-6">
                <v-row>
                  <v-col cols="12">
                    <v-file-input
                      v-model="photoFile"
                      label="Upload Image"
                      accept="image/*"
                      outlined
                      prepend-inner-icon="mdi-camara"
                      :rules="[rules.fileSize]"
                      @change="handleFileUpload"
                    />
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-img
                      v-if="paciente.photo"
                      :src="'data:image/jpeg;base64,' + paciente.photo"
                      max-width="200"
                      max-heigth="200"
                      class="mt-2"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn class="btnPatient" @click="savePacient">
            <span>
              Add Patient
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      pacientes: [],
      dialogAddPacient: false,
      paciente: {
        fullname: '',
        email: '',
        mobile: '',
        dateBirth: '',
        motherTongle: '',
        govId: '',
        sex: '',
        maritalStatus: '',
        address: '',
        city: '',
        zipCode: '',
        state: '',
        country: '',
        district: '',
        international: false,
        photo: 'XDSDEKXLEMP3'
      },
      photoFile: null,
      activeTab: 0,
      tabs: ['Demographics', 'Address', 'Photo'],
      rules: {
        fileSize: v => !v || v.size <= 500 * 1024 || 'Tamaño Maximo 500KB'
      }
    }
  },
  mounted () {
    this.loadPacientes()
  },
  methods: {
    handleFileUpload (event) {
      // ! 1. Constante que capture la imagen:
      const file = event
      // * Validamos tamaño de img:
      const maxPhoto = 500 * 1024
      if (file && file.size > maxPhoto) {
        alert('El archivo supera los 500KB')
        this.photoFile = null
        return
      }
      // ! 2. Constante de tipo archvo:
      const reader = new FileReader()

      reader.onload = (e) => {
        this.paciente.photo = e.target.result.split(',')[1]
      }
      console.log('Photo Selected => ', file, this.paciente.photo)
      reader.readAsDataURL(file)
    },

    async loadPacientes () {
      try {
        const response = await this.$axios.get('/pacientes')
        console.log('Respuesta de Pacientes: ', response)
      } catch (error) {
        console.log('error en: ', error)
      }
    },

    async savePacient () {
      try {
        const response = await this.$axios.post('/pacientes/create', this.paciente)
        console.log('Respuesta de guardar paciente: ', response)
        this.$store.dispatch('alert/triggerAlert', { // ? Payload:
          message: 'Paciente Guardado Datisfactoriamente',
          type: 'success'
        })
        this.dialogAddPacient = false
        this.loadPacientes()
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

<style scoped>
.title {
  font-size: 24rem;
  font-weight: 500;
  color: #101828;
}

.btnFilter {
  background-color: white !important;
  color: #101828 !important;
  margin-right: 10px !important;
  /* border: 1px solid #101828 !important; */
  border-radius: 5px !important;
  padding: 5px 10px !important;
  font-size: 14px !important;
  text-transform: none !important;
}

.btnPatient {
  text-transform: none !important;
  color: white !important;
  border-radius: 5px !important;
  padding: 5px 10px !important;
  background-color: #0E1680 !important;
  font-size: 14px !important;
  margin-right: 10px !important;
  font-weight: 500 !important;
}

/* Estilos de barra para añadir paciente */
.v-tab--active {
  background-color: #0E1680 !important;
  color: white !important;
}
.v-tabs-items {
  transition: all 0.3s ease-in;
}

.tab {
  min-width: 120px;
  height: 50px;
}

/* NAVEGACION DE TRABLA PARA PACIENTES  */
.border-radius-custom {
  border-radius: 6px !important;
}

.border-radius-custom .v-tab {
  border-radius: 6px !important;
  /* margin: 0 4px; */
}

</style>
