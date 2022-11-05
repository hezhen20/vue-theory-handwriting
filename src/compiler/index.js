import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  
  // 1. 生成 ast 树
  let ast = parseHTML(template)

  // 2. 优化静态节点（略去）

  // 3. 通过 ast 树，生成代码
  let code = generate(ast)

  // 4. 将字符串变成函数
  // 通过 with 指定作用域，这样在 code 中的变量就能拿到对应组件实例的变量了
  let render = new Function(`with(this){return ${code}}`)

  return render
}