export const CollapsedReducer = (prevState = {
    isCollapsed: false
}, action) => {
    // console.log(action);
    const { type } = action
    switch (type) {
        case 'change_collapsed':
            let newState = { ...prevState }//必须要先深复制，不能直接操作旧状态
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
            return prevState
    }
}