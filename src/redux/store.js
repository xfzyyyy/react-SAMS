import { createStore, combineReducers } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import { CollapsedReducer } from './reducer/CollapsedReducer'
import { LoadingReducer } from './reducer/LoadingReducer'

//持久化
const persistConfig = {
    key: 'root',//标识
    storage,
    // BLACKLIST
    blacklist: ['LoadingReducer'] // LoadingReducer will not be persisted
}

const reducer = combineReducers({
    CollapsedReducer, LoadingReducer
})


const persistedReducer = persistReducer(persistConfig, reducer)

// const store = createStore(reducer)
// export default store
let store = createStore(persistedReducer)
let persistor = persistStore(store)
export { store, persistor }
