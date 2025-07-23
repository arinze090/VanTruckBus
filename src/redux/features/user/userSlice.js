import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  user: null,
  userRole: null,
  token: null,
  launchScreen: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  destination: null,
  lastAPIFetchTime: null,
  lastLoginTime: null,
  productCategories: null,
  shopProduct: null,
  cartProducts: [],
  wishlistProducts: [],

  truckListings: null,
  bookedTrucks: null,
  userLocationCoordinates: null,

  // firebase token
  fcmToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    getUser: (state, action) => {
      state.user = action.payload;
    },
    saveUserRole: (state, action) => {
      state.userRole = action.payload;
    },
    saveAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    saveRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    saveLaunchScreen: (state, action) => {
      state.launchScreen = action.payload;
    },
    saveLoginTime: (state, action) => {
      state.lastLoginTime = action.payload;
    },
    setLoading: (state, action) => {
      state.loading =
        action.payload?.loading !== undefined
          ? action.payload?.loading
          : state.loading;
    },
    signOut: (state, action) => {
      state.user = null;
      state.userToken = null;
      state.userRole = null;
      state.userPreferences = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.lastLoginTime = null;
      state.destination = null;

      state.cartProducts = [];
      state.wishlistProducts = [];
      state.shopProduct = null;
      state.productCategories = null;

      // therapist section
      state.weeklyAvailability = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };
    },
    setUserDestination: (state, action) => {
      state.destination = action.payload;
    },
    clearDestination: (state, action) => {
      state.destination = null;
    },
    APILastFetchTime: (state, action) => {
      state.lastAPIFetchTime = action.payload;
    },
    saveProductCatgeories: (state, action) => {
      state.productCategories = action.payload;
    },
    saveTruckListings: (state, action) => {
      state.truckListings = action.payload;
    },
    saveBookedTrucks: (state, action) => {
      state.bookedTrucks = action.payload;
    },
    saveProductToCart: (state, action) => {
      state.cartProducts = [...state.cartProducts, action.payload];
    },
    clearCartStore: (state, action) => {
      state.cartProducts = [];
    },
    removeProductFromCart: (state, action) => {
      const updatedSavedItems = state.cartProducts.filter(
        item => item.id !== action.payload.id,
      );

      state.cartProducts = updatedSavedItems;
    },
    saveProductToWishList: (state, action) => {
      state.wishlistProducts = [...state.wishlistProducts, action.payload];
    },
    removeProductFromWishlist: (state, action) => {
      const updatedSavedItems = state.wishlistProducts.filter(
        item => item.id !== action.payload.id,
      );

      state.wishlistProducts = updatedSavedItems;
    },

    updateWeeklyAvailability: (state, action) => {
      console.log('acccc', action.payload);
      const {day, times} = action.payload;
      if (state.weeklyAvailability[day]) {
        state.weeklyAvailability[day] = times;
      }
    },

    saveUserLocationCoordinates: (state, action) => {
      state.userLocationCoordinates = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
  },
});

export const {
  getUser,
  saveUserRole,
  saveAccessToken,
  saveRefreshToken,
  setLoading,
  saveLaunchScreen,
  signOut,
  registerUser,
  setUserDestination,
  clearDestination,
  APILastFetchTime,
  saveLoginTime,
  saveProductCatgeories,

  // user location coordinates
  saveUserLocationCoordinates,

  // truck section
  saveTruckListings,
  saveBookedTrucks,

  saveProductToCart,
  removeProductFromCart,
  clearCartStore,
  saveProductToWishList,
  removeProductFromWishlist,

  updateWeeklyAvailability,

  // fcmtokn
  setFcmToken,
} = userSlice.actions;
export default userSlice.reducer;
