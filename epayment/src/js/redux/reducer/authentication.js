export function setAdminActive(state = null, action) {
    switch(action.type){
        case "SET_USER_ACTIVE":
            return action.payload;
            break;
    }
    return state
}