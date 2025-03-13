import { createContext, Dispatch } from "react"
import { UserType } from "../models/User";


type PartialWithRequiredFields<T, K extends keyof T> = Partial<T> & Pick<T, K>;

type Action = {
    type: 'REGISTER',
    data: Partial<UserType>
} | {
    type: 'LOGIN'
    data: Partial<UserType>
} | {
    type: 'LOG_OUT'

} | {
    type: 'GET_USER'

} | {
    type: 'UPDATE',
    data: Partial<UserType>;
}


export const initialUserState: UserType = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    passwordHash: '',
    password: '',
    address: '',
    phoneNumber: '',
    TZ: "",
    exams: [],
    roles: []
}

export const UserContext = createContext<{
    user: UserType;
    userDispatch: Dispatch<Action>;
}>({
    user: initialUserState,
    userDispatch: () => null
});



export default (state: UserType, action: Action): UserType => {
    switch (action.type) {
        case 'REGISTER':
            return {
                ...state,
                ...action.data, 
            };
        case 'LOGIN':
            {
                console.log('login', action.data);
                
                return {
                    ...state,
                    ...action.data 
                };
            }
           
        case 'LOG_OUT':
            return initialUserState;
        case 'UPDATE':
            return {
                ...state,
                ...action.data 
            };
        default:
            return state;
    }
}
