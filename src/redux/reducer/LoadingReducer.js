export const LoadingReducer = (prevState = {
    isSpinning: false
}, action) => {
    // console.log(action);
    const { type, payload } = action
    switch (type) {
        case 'change_spinning':
            let newState = { ...prevState }//必须要先深复制，不能直接操作旧状态
            newState.isSpinning = payload
            return newState
        default:
            return prevState
    }
}