let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reserve'
]
methods.forEach(method => {
    arrayMethods[method] = function(...args) {
        let res = oldArrayProtoMethods[method].apply(this, args)
        console.log(`谁在调用数组的${method}方法,被我逮住了！`)

        let ob = this.__ob__
        let inserted    // 存放新增操作的参数；新增的操作有可能是新增对象，需要被观测处理
        switch (method) {
            case 'push':
            case 'unshift':     // 这两个方法是往数组头尾新增元素
                inserted = args
                break;
            case 'splice':
                inserted = args.slice(2)    // splice 进行新增时，新增的元素是第二个参数
            default:
                break;
        }
        // 接下来，需要对 inserted 这个数组进行观测，需要用到 observeArray 函数
        if (inserted) {
            ob.observeArray(inserted)
        }
        // 但是问题来了，观测数组需要 observeArray 函数，在另外一个文件中，怎么拿到啊？？？
        // 换言之， observer/array.js 和 observer/index.js 有没有桥梁连接？
        // 有！就是此处的 this，这里的 this 指向的就是调用 push splice 这些方法的数组
        // 也就是对应 observer/index.js 中的 value，所以在observer/index.js 中：
        // 给 value 增加一个属性，这个属性指向类，再通过类拿到 observeArray 方法
        return res
    }
})