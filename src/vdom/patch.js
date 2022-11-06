export function patch(oldVnode, vnode) {
    // 将虚拟节点转化成真实节点
    let el = createElm(vnode)       // 根据虚拟节点产生真实的DOM节点
    let parentElm = oldVnode.parentNode     // 拿到旧节点的父节点
    parentElm.insertBefore(el, oldVnode.nextSibling)    // 把生成的真实节点插入到旧节点的后面
    parentElm.removeChild(oldVnode)     // 删除老的节点
}

function createElm(vnode) {
    let {tag, children, key, data, text} = vnode
    if (typeof tag == 'string') {       // 说明是标签，创建元素，放到 vnode.el 上
        vnode.el = document.createElement(tag)
        updateProperties(vnode)     // 更新元素的属性
        children.forEach(child => {     // 遍历子元素，递归创建元素并放到父元素的子节点中
            vnode.el.appendChild(createElm(child))
        })
    } else {        // 如果是文本，则创建文本元素
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function updateProperties(vnode) {
    let el = vnode.el
    let newProps = vnode.data || {}     // vnode的data放的是属性

    for (let key in newProps) {
        if (key == 'style') {
            for (const styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key == 'class') {
            el.className = el.class
        } else {                // 还有很多种属性，比如事件等等，这里就不写了，源码中也是用的 switch case 一一处理的
            el.setAttribute(key, newProps[key])
        }
    }
}