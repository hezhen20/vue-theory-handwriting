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
function initData() {}
function initComputed() {}
function initWatch() {}