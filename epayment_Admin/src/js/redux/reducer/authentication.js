export function setAdminActive(state = null, action) {
    switch(action.type){
        case "SET_ADMIN_ACTIVE":
            return action.payload;
            break;
    }
    return state
}