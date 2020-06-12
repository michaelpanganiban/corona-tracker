import {FETCH_CASES} from '../type/map'

const initialState = {
    cases: {},
}

const reducerMap = ( state = initialState, action ) => {
    switch(action.type){
                case FETCH_CASES:
                    return {
                        ...state,
                        cases: {
                            ...state.cases,
                            ...action.payload
                        }
                    }
                break
                default:
                    return state
            }
}

export default reducerMap