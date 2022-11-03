const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`   // 标签名
// ?: 匹配不捕获
const qnameCapture = `((?:${ncname}\\:)?${ncname})`   // </xx:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`)  // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)  // 匹配标签结尾的 </div>
// 匹配属性  a="aaa" a='aaa' a=aaa
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/    // 匹配标签结束
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g


export function parseHTML(html) {
  let root    // root 代表生成的 ast 语法树
  let currentParent   // 记录当前哪个元素作为父元素
  let stack = []   // 存放标签对应的ast元素，用于检验标签闭合是否正常

  // 处理开始标签
  function start(tagName, attrs){
    let element = creatASTElement(tagName, attrs)
    if (!root) {  //最开始树是空的
      root = element
    }
    currentParent = element     // 把当前解析的标签当作父元素
    stack.push(element)
  }
  // 处理结束标签
  function end(tagName) {
    // 碰到结束标签，需要重新更新父元素，明确父子关系
    // 具体咋更新：弹出这个结束标签，然后将弹出后的栈顶元素当作当前父元素，同时将他标记为这个结束标签的父元素
    let element = stack.pop()
    currentParent = stack[stack.length-1]
    if (currentParent) {
      element.parent = currentParent  // 明确这个闭合标签的父元素
      currentParent.children.push(element)  // 同时将这个闭合标签作为子元素，双向奔赴
    }
  }
  // 处理文本
  function chars(text) {
    text = text.replace(/\s/g, '')    // 除去空字符
    if (text) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }

  function creatASTElement(tagName, attrs) {
    return {
      tag: tagName,   // 标签名
      type: 1,        // 元素类型
      children: [],   // 子元素列表
      attrs,          // 属性集合
      parent: null    // 父元素
    }
  }

  while(html) {   // 只要 html 不为空就一直解析
    let textEnd = html.indexOf('<')
    
    if (textEnd == 0) {   // 说明碰到 < 了，肯定是标签
      // 处理开始标签
      const startTagMatch = parseStartTag()   // 开始标签匹配的结果
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)   // 放到 start 中处理
        continue
      }
      // 处理结束标签
      const endTagMatch = html.match(endTag)  // 结束标签匹配的结果
      if (endTagMatch) {
        end(endTagMatch[1])     // endTagMatch[1] 是结束标签名， 放到 end 中处理
        advance(endTagMatch[0].length)
        continue
      }
    }

    // 处理文本
    let text
    if (textEnd > 0) {  // 说明是文本
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text)       // 放到 chars 中处理
      advance(text.length)
    }
  }

  // 匹配完需要将html字符串进行截取操作
  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {    // match 的结果start是个数组，第一个元素表示匹配到的字符串，第二个元素是标签名
      const match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)      // 匹配一点就去掉一点，直到html被解析完

      // 开始标签拿到了，接下来把属性都取出来：只要不是结尾标签并且能匹配到属性，就一直循环截取
      let end,attr
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]    // 根据正则 属性的匹配有三种情况
        })
        advance(attr[0].length)
      }

      if (end) {    // 属性都拿出来了，还剩个 > 
        advance(end[0].length)
        return match    // 如此一来，经过 parseStartTag() 一通操作，我们就拿到了开始标签的匹配结果
      }
    }
  }

  return root
}