import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        patch(vm.$el, vnode)
    }
}

export function mountComponent(vm, el) {    // 调用 render 方法去渲染 el 属性

    // 先调用 render 方法创建虚拟节点；再将虚拟节点渲染到页面上
    vm._update(vm._render())
}