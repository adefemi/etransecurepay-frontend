export function setUserContent(state = [], action) {
    switch(action.type){
        case "SET_USER_CONTENT":
            return action.payload;
            break;
    }
    return state
}