
class Observer {
  constructor(value) {

    this.walk(value)      // ？疑惑 为什么要再抽一层 walk，为啥不直接写在 constructor 里面？
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
      if (newValue === value) return
      observe(newValue)     // 如果用户将值修改成了对象，那么这个对象也需要处理
      value = newValue
    }
  })
}

export function observe(data) {
  // 排除不是对象，以及null 的情况
  if (typeof data !== 'object' || data == null) {
    return
  }

  return new Observer(data)   // ？有点不太理解这里为什么要 return ？
}