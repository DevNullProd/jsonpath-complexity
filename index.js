var jp = require("jsonpath")
var aesprim = require('jsonpath/generated/aesprim-browser')

module.exports = {
  complexity : function(jsonpath){
    var components

    try{
      components = jp.parser.parse(jsonpath);
    }catch(err){
      throw new Error("Invalid expression")
    }

    const expressions = components.filter(function(component){
      return component.expression.type == "script_expression" ||
             component.expression.type == "filter_expression"

    })

    const asts = expressions.map(function(expr){
      const start = expr.expression.type == "script_expression" ? 1 : 2
      return aesprim.parse(expr.expression.value.slice(start, -1)).body[0].expression
    })

    function add_tally(orig, add){
      orig.unary   += add.unary
      orig.binary  += add.binary
      orig.logical += add.logical

      return orig
    }

    function tally(obj){
      var obj_total = {
          unary : 0,
         binary : 0,
        logical : 0
      }

      if(obj.type == "UnaryExpression"){
        obj_total.unary += 1
        obj_total = add_tally(obj_total, tally(obj.argument))

      }else if(obj.type == "BinaryExpression"){
        obj_total.binary += 1
        obj_total = add_tally(add_tally(obj_total, tally(obj.left)),
                                                   tally(obj.right))

      }else if(obj.type == "LogicalExpression"){
        obj_total.logical += 1
        obj_total = add_tally(add_tally(obj_total, tally(obj.left)),
                                                   tally(obj.right))
      }

      return obj_total
    }

    var total = {
        unary : 0,
       binary : 0,
      logical : 0
    }

    for(var a = 0; a < asts.length; a += 1){
      const ast_total = tally(asts[a])
      total = add_tally(total, ast_total)
    }

    return {
       components : components.length,
      expressions : expressions.length,
            unary : total.unary,
           binary : total.binary,
          logical : total.logical
    }
  }
}
