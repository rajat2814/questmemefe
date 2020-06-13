import { initializeAxios } from '~/utils/api'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ store, app: { $axios } }: any) => {
  initializeAxios($axios)
}
