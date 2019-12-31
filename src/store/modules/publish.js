// import { storage } from '@dwdjs/utils';

// let publishInfo = storage.get('publish') || {};

const publish = {
  state: {
    storeMessage: '',
  },
  mutations: {
    updatePublish(state, storeMessage) {
      state.storeMessage = storeMessage;
      console.log('更新发布信息', storeMessage);
      // storage.set('publish', storeMessage, 600);
    },
  },
  actions: {
    updatePublish({ commit }, storeMessage) {
      commit('updatePublish', storeMessage);
    },
  },
};

export default publish;
