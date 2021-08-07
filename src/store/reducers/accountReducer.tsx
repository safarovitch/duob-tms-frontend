import {Action} from "redux";

export type accountInitialState = {
    user: object | null
}

const initialState: accountInitialState = {
    user: null
};

const accountReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        default: {
            return state;
        }
    }
}

export default accountReducer;
