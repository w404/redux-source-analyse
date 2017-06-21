import isPlain from 'lodash/isPlainObject';
import $$observable from 'symbol-observable'

/**
 * 1、这是由redux预设的将要执行的动作。使用一个字符串类型type字段来表示，多数情况下，type会被定义成字符串常量。
 * 2、对于任何未知操作，必须返回当前状态。
 * 3、如果当前状态未定义，则必须返回初始状态。
 * 4、不要直接在代码中引用这些操作类型。
 */ 

// 首先定义了一个action类型，我们知道更新state的唯一方法就是dispatch一个action，这个action是用来初始化state的，后面会用到它
export const ActionTypes = {
    INIT: '@@redux/INIT'
}

/**
 * 创建一个Redux仓库存储状态树(store)。
 * 特点：
 * 1、改变存储数据的唯一方法是调用`dispatch()`。
 * 2、应用程序有且仅有一个Redux仓库。
 * 3、为了指定状态树的不同部分对操作的响应，您可以利用`combineReducers`函数把几个reducers合并成一个reducer。
 * @param {Function} reducer：combineReducer返回的reducer函数(一个返回下一个状态树的函数(参数：当前状态树和要处理的操作)。)
 * @param {any} [preloadedState] redux初始化state，可以不传。您可以在全局应用程序中随意指定它状态，或者恢复之前的用户会话。如果你使用`combinereducers`函数产生根reducer，这必须是相同结构的一个对象作为`combinereducers`键。
 * @param {Function} [enhancer] 中间件。您可以选择性第三方插件如中间件、时间旅行、持久性等，增强store。使用Redux的applymiddleware函数加载第三方插件
 * @returns {Store} Redux 仓库。您可以读取状态，派遣行动和订阅的变化。
 */
export default function createStore(reducer, preloadedState, enhancer) {
    if(typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    if(typeof enhancer !== 'undefined') {
        if(typeof enhancer !== 'function') {
            throw new Error('enhancer 必须是一个函数');
        }

        return enhancer(createStore)(reducer, preloadedState);
    }
}