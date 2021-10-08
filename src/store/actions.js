import * as types from './mutation-types'

export const fetchUser = ({ commit }, user) => {
  if (user.id > 0) {
    commit(types.USER_CHECKIN, {
      id: user.id
    })
  }
}
