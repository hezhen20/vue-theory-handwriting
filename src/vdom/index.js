export function renderMixin(Vue) {

    Vue.prototype._c = function() {     // 创建虚拟DOM元素
        return createElement(...arguments)   
    }
    Vue.prototype._v = function(text) {     // 创建虚拟DOM文本元素
        return createTextVnode(text)
    }
    Vue.prototype._s = function(val) {      // stringify
        return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
    }

    Vue.prototype._render = function() {
        const vm = this
        const render = vm.$options.render
        let vnode = render.call(vm)
        console.log(vnode);
        return vnode
    }
}

function createElement(tag, data={}, ...children) {
    return vnode(tag, data, data.key, ...children)
}
function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}
// 用于生成虚拟DOM
function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}