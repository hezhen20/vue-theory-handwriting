const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {  // 对样式进行特殊处理
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type == 1) {
    return generate(node)   // 针对元素节点
  } else {
    let text = node.text    // 获取文本
    
    // return `_v(${JSON.stringify(text)})`
    if (!defaultTagRE.test(text)) {   // 普通文本，不带{{}}
      return `_v(${JSON.stringify(text)})`
    }
    let tokens = []
    let lastIndex = defaultTagRE.lastIndex = 0    // 正则是全局模式，每次使用前需将 lastIndex 置为 0
    let match, index
    while (match = defaultTagRE.exec(text)) {
      index = match.index   // 保存匹配到的索引
      if(index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }
    if (lastIndex < text.length) {    // 说明 }} 后面还有文本
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`
  }
}

function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

export function generate(el) {
  console.log(el);
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
  }${
    children ? `,${children}` : ''
  })`

  console.log(code);
  return code
}