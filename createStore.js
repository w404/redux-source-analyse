import isPlain from 'lodash/isPlainObject';
import $$observable from 'symbol-observable'

/**
 * 首先定义了一个action类型，我们知道更新state的唯一方法就是dispatch一个action，这个action是用来初始化state的，后面会用到它
 */
export const ActionTypes = {
    INIT: '@@redux/INIT'
}

/**
* 接收三个参数
* @param {Function} reducer：当dispatch一个action时，此函数接收action来更新state
* @param {any} [preloadedState]: 初始State
* @param {Function} [enhancer]: 中间件，用来增强store, Redux 定义有applyMiddleware来增强store，后面会单独讲applyMiddleware
* @returns {Store}
*/
export default function createStore(reducer, preloadedState, enhancer) {
    
    // 如果只传了两个参数，并且第二个参数为函数，第二个参数会被当作enhancer
    if(typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    if(typeof enhancer !== 'undefined') {
        // 校验enhancer是否为函数，如果不是函数则抛出异常
        if(typeof enhancer !== 'function') {
            throw new Error('enhancer 必须是一个函数');
        }
        // 如果enhancer存在且为函数，那么则返回如下调用: 假设enhancer为applyMiddleware，那么调用则是applyMiddleware(createStore)(reducer, preloadedState)。后面讲applyMiddleware再详细讲。
        return enhancer(createStore)(reducer, preloadedState);
    }

    // 校验reducer是否为函数，如果不是函数则抛出异常
    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.')
    }
}