import { compileToFunctions } from "./compiler/index"
import { mountComponent } from "./lifecycle"
import { initSate } from "./state"

export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    let vm = this
    vm.$options = options

    initSate(vm)

    // 如果有el属性就说明要渲染模板
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  // 挂载操作
  Vue.prototype.$mount = function(el) {
    const vm = this
    const options = vm.$options
    el = document.querySelector(el)
    vm.$el = el

    if (!options.render) {
      // 如果没有render函数，就看看有没有template，template没有就直接找外部的html
      let template = options.template
      if (!template && el) {
        template = el.outerHTML   // 暂不考虑outerHTML的兼容性问题
      }
      const render = compileToFunctions(template)

      // 如此一来，不管是自己手动写的render方法，还是通过template生成的render方法，现在都拿到了
      options.render = render
    }

    // 挂载这个组件
    mountComponent(vm, el)
  }
}