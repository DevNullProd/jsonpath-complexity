# jsonpath-complexity

Evaluate and summarize the complexity of a JSONPath expression using a simple heuristic.

## Example

```javascript
var jpc = require('jsonpath-complexity');

const complexity = jpc.complexity('$.a[(@.b + 1 == 5)][?(@.c && @d || !@.e || @.f)]')
// {
//   components : 4,
//  expressions : 2,
//        unary : 1,
//       binary : 2,
//      logical : 3
// }
```

## Install

Install from npm:
```bash
$ npm install jsonpath-complexity
```

## API

#### jp.complexity(pathExpression)

Returns a quantitative representation of path extression complexity. Value returned is object with summary of

- number of path *components*
- number of filter and script *expressions*
- number of *unary* operations
- number of *binary* operations (arithmatic and equivalency)
- number of *logical* operations (and/or)

## License

[MIT](LICENSE)
