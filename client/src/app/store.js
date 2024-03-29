import { configureStore } from '@reduxjs/toolkit'
import activitylogReducer from './features/activitylogs/activitylogSlice'
import { apiSlice } from './features/api/apiSlice'
import authReducer from './features/auth/authSlice'
import departmentReducer from './features/departments/departmentSlice'
import lightTrapLogReducer from './features/lighttraplogs/lightTrapLogSlice'
import lightTrapReducer from './features/lighttraps/lightTrapSlice'
import locationReducer from './features/locations/locationSlice'
import productReducer from './features/products/productsSlice'
import productTypeReducer from './features/producttypes/productTypeSlice'

export const store = configureStore({
  reducer: {
    activity: activitylogReducer,
    product: productReducer,
    department: departmentReducer,
    auth: authReducer,
    productType: productTypeReducer,
    location: locationReducer,
    lighttrap: lightTrapReducer,
    lighttraplogs: lightTrapLogReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})
