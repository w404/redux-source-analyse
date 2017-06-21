# Redux源码解析

## Redux 是什么？
Redux 是 JavaScript 状态容器，提供可预测化的状态管理。

## Redux 能做什么？
提供了和双向绑定思想不同的单向数据流，应用状态可以预测，可以回溯，更易于调试。

## Redux API
```javascript
export {
    createStore, // 创建一个store仓库用来存储状态
    combineReducers, // 合并reducer
    bindActionCreators, // 将dispatch和action结合
    applyMiddleware, // 使用中间件来增强store，例如中间件redux-thunk等
    compose // 从右向左组合多个函数, compose(f, g, h)会返回(...args) => f(g(h(...args)))
}
```
从API可以看出，Redux核心模块createStore、combineReducers、bindActionCreators、applyMiddleware、compose，除此之外，还有一些工具函数。

## createStore
```javascript
export const ActionTypes = {
    INIT: '@@redux/INIT'
}
```
首先定义了一个action类型，我们知道更新state的唯一方法就是dispatch一个action，这个action是用来初始化state的，后面会用到它。

接下来看下createStore的大体结构：
```javascript
/**
* 接收三个参数
* @param {Function} reducer：当dispatch一个action时，此函数接收action来更新state
* @param {any} [preloadedState]: 初始State
* @param {Function} [enhancer]: 中间件，用来增强store, Redux 定义有applyMiddleware来增强store，后面会单独讲applyMiddleware
*/
export default function createStore(reducer, preloadedState, enhancer) {
    // 如果只传了两个参数，并且第二个参数为函数，第二个参数会被当作enhancer
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
        // 校验enhancer是否为函数，如果不是函数则抛出异常
        if (typeof enhancer !== 'function') {
            throw new Error('Expected the enhancer to be a function.');
        }
        // 如果enhancer存在且为函数，那么则返回如下调用: 假设enhancer为applyMiddleware，那么调用则是applyMiddleware(createStore)(reducer, preloadedState)。后面讲applyMiddleware再详细讲。
        return enhancer(createStore)(reducer, preloadedState);
    }

    // 校验reducer是否为函数，如果不是函数则抛出异常
    if (typeof reducer !== 'function') {
        throw new Error('Expected the reducer to be a function.')
    }
    
    // 获取reducer
    let currentReducer = reducer;

    // 获取初始state，没有传递则为undefined
    let currentState = preloadedState;

    // 定义一个数组用来存放listeners。就是一个函数数组，当state发生改变时，会循环执行这个数组里面的函数
    let currentListeners = [];

    // 用来存储下一次的listeners数组。为什么要有这个listeners数组呢？因为当state发生改变时，我们根据上面的currentListeners来循环执行函数，但是在这执行这些函数时，函数内部可能取消或者添加订阅（state改变时，添加或者取消执行函数），这时如果直接操作currentListeners ，相当于在循环内部修改循环条件，执行瞬间就乱套了。
    let nextListeners = currentListeners;

    // reducer函数是否正在执行的标识
    let isDispatching = false;

    function ensureCanMutateNextListeners() {
        if (nextListeners === currentListeners) {
            nextListeners = currentListeners.slice();
        }
    }

    // 从store获取状态树
    function getState() {
        return currentState;
    }

    // 接收一个函数参数，订阅state的改变。当state改变时会执行这个函数
    function subscribe(listener) {
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }

        let isSubscribed = true

        ensureCanMutateNextListeners();
        nextListeners.push(listener)

        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }

            isSubscribed = false

            ensureCanMutateNextListeners()
            const index = nextListeners.indexOf(listener)
            nextListeners.splice(index, 1)
        }
    }

    // 触发action去执行reducer，更新state
    function dispatch(action) {
        if (!isPlainObject(action)) {
            throw new Error(
                'Actions must be plain objects. ' +
                'Use custom middleware for async actions.'
            )
        }

        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. ' +
                'Have you misspelled a constant?'
            )
        }

        if (isDispatching) {
            throw new Error('Reducers may not dispatch actions.')
        }

        try {
            isDispatching = true
            currentState = currentReducer(currentState, action)
        } finally {
            isDispatching = false
        }

        const listeners = currentListeners = nextListeners
        for (let i = 0; i < listeners.length; i++) {
            const listener = listeners[i]
            listener()
        }

        return action
    }

    // 替换reducer
    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.')
        }

        currentReducer = nextReducer
        dispatch({ type: ActionTypes.INIT })
    }

    function observable() {
        const outerSubscribe = subscribe
        return {
            subscribe(observer) {
            if (typeof observer !== 'object') {
                throw new TypeError('Expected the observer to be an object.')
            }

            function observeState() {
                if (observer.next) {
                observer.next(getState())
                }
            }

            observeState()
            const unsubscribe = outerSubscribe(observeState)
                return { unsubscribe }
            },

            [$$observable]() {
                return this
            }
        }
    }

    // 执行dispatch函数，初始化state
    dispatch({ type: ActionTypes.INIT })
    
    // 返回值
    return {
        dispatch, // 触发action去执行reducer，更新state
        subscribe, // 订阅state改变，state改变时会执行subscribe的参数（自定义的一个函数）
        getState, // 获取state
        replaceReducer, // 替换reducer
        [$$observable]: observable
    }
}
```

