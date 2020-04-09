import { SET_COLLABS_PENDING, SET_COLLABS_SUCCESS, SET_COLLABS_ERROR, SET_CURRENT_COLLAB, CLEAR_CURRENT_COLLAB, ADD_COLLAB, REMOVE_COLLAB, UPDATE_COLLAB } from '../constants'
import { GET_USER_MEDIA_PENDING, GET_USER_MEDIA_SUCCESS, GET_USER_MEDIA_ERROR } from '../constants/response/types'

const initialState = {
    all_collabs: [],
    current_collab: {},
    pending: null,
    error: null,
    publications: []
}

const collabReducer = (state = initialState, action) => {
    let collabs = [...state.all_collabs]
    switch (action.type) {

        case SET_COLLABS_PENDING:

            return {
                ...state,
                pending: true,
                error: null
            }

        case SET_COLLABS_SUCCESS:

            return {
                ...state,
                pending: false,
                all_collabs: [...action.collabs]
            }

        case SET_COLLABS_ERROR:

            return {
                ...state,
                pending: false,
                error: { type: action.type, message: action.message }
            }

        case SET_CURRENT_COLLAB:

            return {
                ...state,
                current_collab: { ...action.collab },
                pending: false
            }

        case CLEAR_CURRENT_COLLAB:

            return {
                ...state,
                current_collab: {},
                pending: null
            }

        case ADD_COLLAB:

            return {
                ...state,
                all_collabs: [...collabs, action.collab]
            }

        case UPDATE_COLLAB:
            collabs.splice(getIndex(collabs, action.collab), 1, action.collab)

            return {
                ...state,
                all_collabs: [...collabs]

            }

        case REMOVE_COLLAB:

            return {
                ...state,
                all_collabs: [...collabs.filter(c => c.details.id !== action.collab.details.id)]
            }


        case GET_USER_MEDIA_PENDING:

            return {
                ...state,
                pending: true,
                error: null
            }

        case GET_USER_MEDIA_SUCCESS:

            return {
                ...state,
                publications: [...action.media],
                pending: false
            }

        case GET_USER_MEDIA_ERROR:

            return {
                ...state,
                response: { type: action.type, message: action.message },
                pending: false,
                error: true
            }

        default:
            return state
    }
}

export const getIndex = (collabs, collab) => collabs.map(c => { return c }).indexOf(collab.details.id)
export const searchedCollabs = (state, text) => [...state.collabs.filter(collab => collab.details.title.toLowerCase().includes(text.toLowerCase()))]

export default collabReducer