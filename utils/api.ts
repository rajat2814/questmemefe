import { NuxtAxiosInstance } from '@nuxtjs/axios'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  axiosInstance.setBaseURL(`${process.env.SERVER_URL}`)
  $axios = axiosInstance
}

export { $axios }