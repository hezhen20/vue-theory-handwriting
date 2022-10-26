import { arrayMethods } from "./array"

class Observer {
  constructor(value) {

    // 给 value 加一个 __ob__ 属性，如果有这个属性，那么就代表这个对象被观测过
    Object.defineProperty(value, '__ob__', {
      enumerable: false,    // 不能被枚举
      configurable: false,
      value: this
    })
    /**
      上面这串代码捋一下：
      这串代码可以实现两个目的：
      1. 标识一个对象是否被观测过，防止重复观测
      2. 能在 observer/array.js 中调用 observeArray 方法
      第一个目的好理解，第二个目的怎么理解？
      value 上有一个 __ob__ 属性，它代表的是 Observer 的实例，可以拿到 observeArray 方法；
      而这个 value 会在 array.js 中调用 push 等方法，二者之间的桥梁就搭起来了。
     */

    if (Array.isArray(value)) {
      // 改变数组的原型，目的是为了重写push pop shift unshift splice sort reverse 这七个方法
      value.__proto__ = arrayMethods
      // 数组中的元素有可能也是对象，所以也要对其处理
      this.observeArray(value)
    } else {      
      this.walk(value)      // 针对对象的处理
    }
  }
  observeArray(value) {
    value.forEach(item => {
      observe(item)
    })
  }
  walk(data) {
    let keys = Object.keys(data)
    keys.forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function defineReactive(data, key, value) {
  observe(value)  // 递归调用，因为 value 也有可能是对象
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newValue) {
      console.log('set...新值为：', newValue)
      if (newValue === value) return
      observe(newValue)     // 如果用户将值修改成了对象，那么这个对象也需要处理
      value = newValue
    }
  })
}

export function observe(data) {
  // 排除不是对象，以及null 的情况
  if (typeof data !== 'object' || data == null) {
    return data
  }
  if (data.__ob__) {    // 说明被观测过了，防止重复观测
    return data
  }
  return new Observer(data)   // ？有点不太理解这里为什么要 return ？
}