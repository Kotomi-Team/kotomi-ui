import { Query } from 'rc-query/dist/interface'


export interface State {
    querys: Query[]
}

type Action = { type: 'SET_QUERYS', payload: Query[] }

export const initialState = { querys: [] };

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case 'SET_QUERYS':
            return { ...state, querys: action.payload };
        default:
            throw new Error();
    }
}
