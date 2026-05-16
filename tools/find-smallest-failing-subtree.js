#!/usr/bin/env node

const escodegen = require("escodegen");

/*
Usage:
    node find-smallest-failing-subtree.js ast.json

The program:
1. Loads an AST from a JSON file
2. Checks whether escodegen.generate(ast) fails
3. Finds the smallest failing subtree
4. Prints its path, type, error, and JSON
*/

async function main() {
  const fs = require("fs/promises");
  const filename = process.argv[2];

  if (!filename) {
    console.error("Usage: node find-smallest-failing-subtree.js ast.json");
    process.exit(1);
  }

  let ast;
  try {
    const text = await fs.readFile(filename, "utf8");
    ast = JSON.parse(text);
  } catch (err) {
    console.error("Failed to read or parse JSON:", err.message);
    process.exit(1);
  }

  const rootError = tryGenerate(ast);
  if (!rootError.ok) {
    const result = findSmallestFailingSubtree(ast);

    if (!result) {
      console.log(
        "The full AST fails, but no failing subtree with a .type field was found.",
      );
      process.exit(2);
    }

    console.log("Smallest failing subtree found");
    console.log("============================");
    console.log("Path:  " + formatPath(result.path));
    console.log("Type:  " + result.node.type);
    console.log("Error: " + result.error.message);
    console.log("");
    console.log(JSON.stringify(result.node, null, 2));
  } else {
    console.log("The AST does not fail. escodegen.generate() succeeded.");
  }
}

function tryGenerate(node) {
  try {
    escodegen.generate(node);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function findSmallestFailingSubtree(ast) {
  return visit(ast, []);

  function visit(node, path) {
    if (!isAstNode(node)) {
      return null;
    }

    const current = tryGenerate(node);
    if (current.ok) {
      return null;
    }

    let bestChildFailure = null;

    forEachChildNode(node, function (child, childPath) {
      const childFailure = visit(child, childPath);
      if (!childFailure) {
        return;
      }

      if (!bestChildFailure || childFailure.size < bestChildFailure.size) {
        bestChildFailure = childFailure;
      }
    });

    if (bestChildFailure) {
      return bestChildFailure;
    }

    return {
      node: node,
      path: path.slice(),
      error: current.error,
      size: countNodes(node),
    };
  }
}

function isAstNode(value) {
  return value && typeof value === "object" && typeof value.type === "string";
}

function forEachChildNode(node, callback) {
  for (const key of Object.keys(node)) {
    const value = node[key];

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (isAstNode(item)) {
          callback(item, [].concat(key, i));
        }
      }
    } else if (isAstNode(value)) {
      callback(value, [key]);
    }
  }
}

function countNodes(node) {
  if (!isAstNode(node)) {
    return 0;
  }

  let total = 1;

  for (const key of Object.keys(node)) {
    const value = node[key];

    if (Array.isArray(value)) {
      for (const item of value) {
        total += countNodes(item);
      }
    } else {
      total += countNodes(value);
    }
  }

  return total;
}

function formatPath(path) {
  if (!path || path.length === 0) {
    return "<root>";
  }

  let result = "";
  for (const part of path) {
    if (typeof part === "number") {
      result += "[" + part + "]";
    } else {
      if (result) {
        result += ".";
      }
      result += part;
    }
  }
  return result;
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
