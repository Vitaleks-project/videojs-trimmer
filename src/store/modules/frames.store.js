function initialState() {
    return {
        frames: [],
        videoDuration: 0
    };
}

const getters = {
    videoFrames: (state) => state.frames,
    videoDuration: (state) => state.videoDuration,
};

const mutations = {
    SET_VIDEO_FRAMES(state, payload) {
        state.frames = payload;
    },
    SET_VIDEO_DURATION(state, payload) {
        state.videoDuration = payload;
    }
};

const actions = {
    setVideoFrames({ commit }, frames) {
        commit('SET_VIDEO_FRAMES', frames);
    },
    setVideoDuration({ commit }, duration) {
        commit('SET_VIDEO_DURATION', duration);
    }
};


export default {
    namespaced: true,
    state: initialState,
    getters,
    mutations,
    actions
};
