import { createSlice } from '@reduxjs/toolkit';

// Se crean los estados iniciales
const initialState = {
  currentVideo: null,
  loading: false,
  error: false,
};

export const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    // Se procede a crear las funciones que cambian los estados
    // Cuando iniciemos sesion se disparara esta funcion y asi con las demas
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.currentVideo = action.payload;
    },
    fetchFailure: (state) => {
      state.loading = false;
      state.error = true;
    },

    // Se crea una funcion que valida si ya se dio like o dislike, si se dio like borra el id del dislike y lo pasa a like
    like: (state, action) => {
      // Si en los likes del video no se encuentra mi id :
      // action.payload en este caso hace referencia al id del usuario
      if (!state.currentVideo.likes.includes(action.payload)) {
        // Envia el id del usuario a la propiedad like del video
        state.currentVideo.likes.push(action.payload);
        // Si ya le habia dado dislike al video, se elimina el id de los dislikes
        state.currentVideo.dislikes.splice(
          state.currentVideo.dislikes.findIndex(
            (userId) => userId === action.payload
          ),
          1
        );
      }
    },

    dislike: (state, action) => {
      // Si en los likes del video no se encuentra mi id :
      // action.payload en este caso hace referencia al id del usuario
      if (!state.currentVideo.dislikes.includes(action.payload)) {
        // Envia el id del usuario a la propiedad like del video
        state.currentVideo.dislikes.push(action.payload);
        // Si ya le habia dado dislike al video, se elimina el id de los dislikes
        state.currentVideo.likes.splice(
          state.currentVideo.likes.findIndex(
            (userId) => userId === action.payload
          ),
          1
        );
      }
    },
  },
})

// Se exportan nuestras funciones y el reducer para poderlos usar en otros componentes
export const { fetchStart, fetchSuccess, fetchFailure, like, dislike } = videoSlice.actions;
export default videoSlice.reducer;