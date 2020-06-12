import {FETCH_CASES} from '../type/map'

export function fetchCases(payload){
    return {
        type: FETCH_CASES,
        payload
    }
}