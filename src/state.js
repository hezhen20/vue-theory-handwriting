import { observe } from "./observer/index"

export function initSate(vm) {
  const opts = vm.$options
  if (opts.props) {
    initProps(vm)
  }
  if (opts.methods) {
    initMethods(vm)
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
}

function initProps() {}
function initMethods() {}
function proxy(vm, data, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[data][key]  // vm.a 就相当于 vm._data.a
    },
    set(newValue) {
      vm[data][key] = newValue    // vm.a = 10 就相当于 vm._data.a = 10
    }
  })
}
function initData(vm) {
  let data = vm.$options.data

  // 判断 data 是不是函数
  // 添加 _data 使得 用户可以通过实例访问
  vm._data = data = typeof data == 'function' ? data.call(vm) : data
  
  for (const key in data) {
    proxy(vm, '_data', key)
  }

  observe(data)
}
function initComputed() {}
function initWatch() {}