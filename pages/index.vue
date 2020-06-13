<template>
  <v-container>
    <v-snackbar
      v-model="snackbar" timeout="2000" v-if="cookieConsent">
      Cookies Stored:- {{ cookiesInfo }}
    </v-snackbar>
    <v-row justify="center" data-app>
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">Allow Cookies?</v-card-title>
          <v-card-text>This Site Stores Cookies</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="disagreeCookies()">Disagree</v-btn>
            <v-btn color="green darken-1" text @click="agreeCookies()">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row>
      <v-col>
          <v-btn text @click="$auth.logout()">Logout</v-btn>
      </v-col>
    </v-row>
    <v-row class="align-end" v-if="cookieConsent == false">
        The Cookie Consent is required for Memes To Show Click&nbsp;<a @click="dialog=true"><span>here</span></a>&nbsp;to enable us to store cookies 
    </v-row>
    <h1> Top 5 Memes </h1>
     <v-row v-if="cookieConsent">
      <v-col
        v-for="meme, i in memes"
        :key="i"
        cols="6"
        md="4"
      >
        <v-card
            class="mx-auto"
            max-width="400"
          >
            <v-img
              class="white--text align-end"
              height="200px"
              :src="meme.url"
            >
              <!-- <v-card-title>{{ meme.name }}</v-card-title> -->
            </v-img>

            <!-- <v-card-subtitle class="pb-0">Number 10</v-card-subtitle> -->

            <v-card-text class="text--primary">
              <div>{{ meme.name }}</div>

              <!-- <div>Whitsunday Island, Whitsunday Islands</div> -->
            </v-card-text>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import cookies from 'js-cookie'
import { $axios } from '~/utils/api'

export default {
  data() {
    return {
      cookieConsent: this.$auth.user.cookie_consent,
      dialog: false,
      snackbar: true,
      multiLine: true,
      timeout: 5000,
      text: 'Cookie Information',
      memes: [],
      cookiesInfo: null
    }
  },
  components: {
    Logo,
    VuetifyLogo
  },
  created() {
    if (this.cookieConsent == null) {
      this.dialog = true
    }
    $axios({
      method: 'get',
      url: '/api/meme/get_memes',
    })
    .then((response) => {
      if (response) {
        this.memes = response.data.slice(0, 5)
      }
    })
    // alert(this.$auth.user.user_data.first_name)
    this.cookiesInfo = cookies.get()
  },
  methods: {
    async agreeCookies() {
        this.dialog = false
        const consent = 'Y'
        await $axios({
          method: 'post',
          url: '/api/cookie/consent/',
          data: {
            consent
          }
        })
          .then((response) => {
            const user_data = {
              user_data: this.$auth.user.user_data,
              cookie_consent: true
            }
            this.cookieConsent = true
            this.$auth.setUser(user_data)
          })
        

    },
    async disagreeCookies() {
      this.dialog = false
      const consent = 'N'
      await $axios({
          method: 'post',
          url: '/api/cookie/consent/',
          data: {
            consent
          }
        })
          .then((response) => {

            const user_data = {
              user_data: this.$auth.user.user_data,
              cookie_consent: false
            }
            this.cookieConsent = false
            this.$auth.setUser(user_data)
          })
        await this.$auth.logout()
        this.$router.replace({ path: '/login' })
    }
  }
}
</script>
<style scoped>
a,
a label {
    cursor: pointer;
}
span {
  color: red;
}
</style>