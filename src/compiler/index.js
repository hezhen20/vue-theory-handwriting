import { generate } from "./generate";
import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  
  // 1. 生成 ast 树
  let ast = parseHTML(template)

  // 2. 优化静态节点（略去）

  // 3. 通过 ast 树，生成代码
  let code = generate(ast)
}