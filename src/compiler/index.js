import { parseHTML } from "./parse";

export function compileToFunctions(template) {
  
  let ast = parseHTML(template)
  console.log('生成的ast：', ast);
}