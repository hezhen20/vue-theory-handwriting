import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"

function Vue(options) {
  this._init(options)
}

// 初始化方法
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue