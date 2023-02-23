import { createSlice } from '@reduxjs/toolkit';

// Se crean los estados iniciales
const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Se procede a crear las funciones que cambian los estados
    // Cuando iniciemos sesion se disparara esta funcion y asi con las demas
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      // si dentro de la propiedad subscribedUsers de nuestro currentUser se encuentra el id:
      if (state.currentUser.subscribedUsers.includes(action.payload)) {
        // Se procede a eliminar el id del array
        state.currentUser.subscribedUsers.splice(
          state.currentUser.subscribedUsers.findIndex(
            (channelId) => channelId === action.payload
          ),
          1
        );
      } else {
        // Si el id no se encuentra en el Array, se agrega
        state.currentUser.subscribedUsers.push(action.payload);
      }
    }
  },
})

// Se exportan nuestras funciones y el reducer para poderlos usar en otros componentes
export const { loginStart, loginSuccess, loginFailure, logout, subscription } = userSlice.actions;
export default userSlice.reducer;