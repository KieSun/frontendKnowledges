;(function(modules) {
  function require(id) {
    const module = { exports: {} }
    modules[id](module, module.exports, require)
    return module.exports
  }
  require('./entry.js')
})({
  './entry.js': function(module, exports, require) {
    'use strict'

    var _a = require('./a.js')

    var _a2 = _interopRequireDefault(_a)

    var _b = require('./b.js')

    var _b2 = _interopRequireDefault(_b)

    require('./index.css')

    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { default: obj }
    }

    console.log(_a2.default + _b2.default)
  },
  './a.js': function(module, exports, require) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    var a = 1

    exports.default = a
  },
  './b.js': function(module, exports, require) {
    'use strict'

    Object.defineProperty(exports, '__esModule', {
      value: true
    })
    var b = 2

    exports.default = b
  },
  './index.css': function(module, exports, require) {
    const style = document.createElement('style')
    style.innerText = 'body {\n  background-color: yellow;\n}\n'
    document.head.appendChild(style)
  }
})
