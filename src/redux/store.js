import { createStore, applyMiddleware, compose, combineReducers  } from 'redux'
import thunk from 'redux-thunk'

// reducers
import reducerMap from './reducers/reducer-map'


const middlewares = compose(applyMiddleware(thunk))

const reducers = combineReducers({
    reducerMap
})

export default createStore(reducers, middlewares)