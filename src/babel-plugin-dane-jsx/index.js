module.exports = function(babel) {
  var t = babel.types;
  return {
    visitor: {
        // path.replaceWith(
        //   t.callExpression(
        //     t.identifier('$add'),
        //     [ path.node.left, path.node.right ]
        //   )
        // );
      // },
      BinaryExpression: function (path) {
        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier('$'), t.identifier('add')),
            path.node.left
          )
        );
      }
    }
  };
};
