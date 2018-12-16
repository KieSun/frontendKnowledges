const fs = require('fs')
const path = require('path')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

function readCode(filePath) {
  console.log(filePath)
  const content = fs.readFileSync(filePath, 'utf-8')
  const ast = babylon.parse(content, {
    sourceType: 'module'
  })
  const dependencies = []
  traverse(ast, {
    ImportDeclaration: ({ node }) => {
      dependencies.push(node.source.value)
    }
  })
  const { code } = transformFromAst(ast, null, {
    presets: ['env']
  })
  return {
    filePath,
    dependencies,
    code
  }
}

function getDependencies(entry) {
  const entryObject = readCode(entry)
  const dependencies = [entryObject]
  for (const asset of dependencies) {
    const dirname = path.dirname(asset.filePath)
    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath)
      if (/\.css$/.test(absolutePath)) {
        const content = fs.readFileSync(absolutePath, 'utf-8')
        const code = `
          const style = document.createElement('style')
          style.innerText = ${JSON.stringify(content).replace(/\\r\\n/g, '')}
          document.head.appendChild(style)
        `
        dependencies.push({
          filePath: absolutePath,
          relativePath,
          dependencies: [],
          code
        })
      } else {
        const child = readCode(absolutePath)
        child.relativePath = relativePath
        dependencies.push(child)
      }
    })
  }
  return dependencies
}
function bundle(dependencies, entry) {
  let modules = ''
  dependencies.forEach(dep => {
    const filePath = dep.relativePath || entry
    modules += `'${filePath}': (
      function (require) { ${dep.code} }
    ),`
  })
  const result = `
    (function(modules) {
      function require(id) {
        const module = { exports : {} };
        modules[id](module, module.exports, require);
        return module.exports;
      }
      require('${entry}')
    })({${modules}})
  `
  fs.writeFileSync('./bundle.js', result)
}

const dep = getDependencies('./entry.js')
bundle(dep, './entry.js')
