import createStore from './createStore';
import combineReducers from './combineReducers';
import bindActionCreators from './bindActionCreators';
import applyMiddleware from './applyMiddleware';
import compose from './compose';
import warning from './utils/warning';

export {
    createStore, // 创建一个store用来存储状态树
    combineReducers, // 合并reducer
    bindActionCreators, // 将dispatch和action结合
    applyMiddleware, // 调度中间件来增强store，例如中间件redux-thunk等
    compose // 从右向左组合多个函数, compose(f, g, h)会返回(...args) => f(g(h(...args)))
}