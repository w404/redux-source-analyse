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