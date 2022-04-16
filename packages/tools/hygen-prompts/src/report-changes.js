const treeify = require('treeify');

exports.ReportChanges = (files) => console.log(treeify.asTree(files));
