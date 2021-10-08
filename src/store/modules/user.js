import { concat } from 'lodash'
import { ls } from 'vue'
// import user  from '../../api/user'
import * as types from '../mutation-types';
import commonApi from '../../api/common';

// init state
// shape: []|false
const state = {
    user: null,
    companyInfo: false,
};

// getters
const getters = {
    userInfo: state => state.user
};

// actions
const actions = {
    // userInfo ({ commit, state }, actions) {
    //     let user = { name: 'andy'}
    //     commit(types.USER_CHECKIN, user);
    // }
    holiday({ commit, state }) {
        return new Promise((resolve, reject) => {
            commonApi
                .holiday()
                .then(res => {
                    // console.log(res, 444)
                    commit(types.USER_CHECKIN, res);
                    resolve(res)
                })
                .catch(reason => reject(reason))
        })
    },
};

// mutations
const mutations = {
    [types.USER_CHECKIN] (state, user) {
        state.user = user
    },
};

export default {
  state,
  getters,
  actions,
  mutations
}
