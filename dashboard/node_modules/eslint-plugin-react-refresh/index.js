// src/only-export-components.ts
var reactComponentNameRE = /^[A-Z][a-zA-Z0-9_]*$/u;
var onlyExportComponents = {
  meta: {
    messages: {
      exportAll: "This rule can't verify that `export *` only exports components.",
      namedExport: "Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.",
      anonymousExport: "Fast refresh can't handle anonymous components. Add a name to your export.",
      localComponents: "Fast refresh only works when a file only exports components. Move your component(s) to a separate file. If all exports are HOCs, add them to the `extraHOCs` option.",
      noExport: "Fast refresh only works when a file has exports. Move your component(s) to a separate file.",
      reactContext: "Fast refresh only works when a file only exports components. Move your React context(s) to a separate file."
    },
    type: "problem",
    schema: [
      {
        type: "object",
        properties: {
          extraHOCs: { type: "array", items: { type: "string" } },
          allowExportNames: { type: "array", items: { type: "string" } },
          allowConstantExport: { type: "boolean" },
          allowCompoundComponents: { type: "boolean" },
          checkJS: { type: "boolean" }
        },
        additionalProperties: false
      }
    ]
  },
  defaultOptions: [],
  create: (context) => {
    const {
      extraHOCs = [],
      allowExportNames,
      allowConstantExport = false,
      allowCompoundComponents = false,
      checkJS = false
    } = context.options[0] ?? {};
    const filename = context.filename;
    if (filename.includes(".test.") || filename.includes(".spec.") || filename.includes(".cy.") || filename.includes(".stories.")) {
      return {};
    }
    const shouldScan = filename.endsWith(".jsx") || filename.endsWith(".tsx") || checkJS && filename.endsWith(".js");
    if (!shouldScan) return {};
    const allowExportNamesSet = allowExportNames ? new Set(allowExportNames) : void 0;
    const validHOCs = ["memo", "forwardRef", "lazy", ...extraHOCs];
    const getHocName = (node) => {
      const callee = node.type === "CallExpression" ? node.callee : node.tag;
      if (callee.type === "CallExpression") {
        return getHocName(callee);
      }
      if (callee.type === "MemberExpression") {
        if (callee.property.type === "Identifier" && validHOCs.includes(callee.property.name)) {
          return callee.property.name;
        }
        if (callee.object.type === "Identifier" && validHOCs.includes(callee.object.name)) {
          return callee.object.name;
        }
        if (callee.object.type === "CallExpression") {
          return getHocName(callee.object);
        }
      }
      if (callee.type === "Identifier") {
        return callee.name;
      }
      return void 0;
    };
    const isCallExpressionReactComponent = (node) => {
      const hocName = getHocName(node);
      if (!hocName || !validHOCs.includes(hocName)) return false;
      const validateArgument = hocName === "memo" || hocName === "forwardRef";
      if (!validateArgument) return true;
      if (node.arguments.length === 0) return false;
      const arg = skipTSWrapper(node.arguments[0]);
      switch (arg.type) {
        case "Identifier":
          return reactComponentNameRE.test(arg.name);
        case "FunctionExpression":
        case "ArrowFunctionExpression":
          if (!arg.id) return "needName";
          return reactComponentNameRE.test(arg.id.name);
        case "CallExpression":
          return isCallExpressionReactComponent(arg);
        default:
          return false;
      }
    };
    const isExpressionReactComponent = (expressionParam) => {
      const exp = skipTSWrapper(expressionParam);
      if (exp.type === "Identifier") {
        return reactComponentNameRE.test(exp.name);
      }
      if (exp.type === "ArrowFunctionExpression" || exp.type === "FunctionExpression") {
        if (exp.params.length > 2) return false;
        if (!exp.id?.name) return "needName";
        return reactComponentNameRE.test(exp.id.name);
      }
      if (exp.type === "ConditionalExpression") {
        const consequent = isExpressionReactComponent(exp.consequent);
        const alternate = isExpressionReactComponent(exp.alternate);
        if (consequent === false || alternate === false) return false;
        if (consequent === "needName" || alternate === "needName") {
          return "needName";
        }
        return true;
      }
      if (exp.type === "CallExpression") {
        return isCallExpressionReactComponent(exp);
      }
      if (exp.type === "TaggedTemplateExpression") {
        const hocName = getHocName(exp);
        if (!hocName || !validHOCs.includes(hocName)) return false;
        return "needName";
      }
      if (exp.type === "MemberExpression" && !exp.computed) {
        return reactComponentNameRE.test(exp.property.name);
      }
      if (allowCompoundComponents && exp.type === "ObjectExpression") {
        if (exp.properties.length === 0) return false;
        return exp.properties.every((property) => {
          if (property.type !== "Property" || property.kind !== "init") {
            return false;
          }
          const value = skipTSWrapper(property.value);
          if (value.type === "ObjectExpression") return false;
          if (value.type === "AssignmentPattern" || value.type === "TSEmptyBodyFunctionExpression") {
            return false;
          }
          const result = isExpressionReactComponent(value);
          if (result === "needName") {
            if (property.computed) return false;
            const key = property.key.type === "Identifier" ? property.key.name : property.key.value;
            return typeof key === "string" && reactComponentNameRE.test(key);
          }
          return result;
        });
      }
      return false;
    };
    return {
      Program(program) {
        let hasExports = false;
        let hasReactExport = false;
        let reactIsInScope = false;
        const localComponents = [];
        const nonComponentExports = [];
        const reactContextExports = [];
        const handleExportIdentifier = (identifierNode, initParam) => {
          if (identifierNode.type !== "Identifier") {
            nonComponentExports.push(identifierNode);
            return;
          }
          if (allowExportNamesSet?.has(identifierNode.name)) return;
          if (!initParam) {
            if (reactComponentNameRE.test(identifierNode.name)) {
              hasReactExport = true;
            } else {
              nonComponentExports.push(identifierNode);
            }
            return;
          }
          const init = skipTSWrapper(initParam);
          if (allowConstantExport && constantExportExpressions.has(init.type)) {
            return;
          }
          if (init.type === "CallExpression" && (init.callee.type === "Identifier" && init.callee.name === "createContext" || init.callee.type === "MemberExpression" && init.callee.property.type === "Identifier" && init.callee.property.name === "createContext")) {
            reactContextExports.push(identifierNode);
            return;
          }
          const isReactComponent = reactComponentNameRE.test(identifierNode.name) && isExpressionReactComponent(init);
          if (isReactComponent === false) {
            nonComponentExports.push(identifierNode);
          } else {
            hasReactExport = true;
          }
        };
        const handleExportDeclaration = (node) => {
          if (node.type === "VariableDeclaration") {
            for (const variable of node.declarations) {
              if (variable.init === null) {
                nonComponentExports.push(variable.id);
                continue;
              }
              handleExportIdentifier(variable.id, variable.init);
            }
          } else if (node.type === "FunctionDeclaration") {
            if (node.id === null) {
              context.report({ messageId: "anonymousExport", node });
            } else {
              handleExportIdentifier(node.id);
            }
          } else if (node.type === "ClassDeclaration") {
            if (node.id === null) {
              context.report({ messageId: "anonymousExport", node });
            } else if (reactComponentNameRE.test(node.id.name) && node.superClass !== null && node.body.body.some(
              (item) => item.type === "MethodDefinition" && item.key.type === "Identifier" && item.key.name === "render"
            )) {
              hasReactExport = true;
            } else {
              nonComponentExports.push(node.id);
            }
          } else if (node.type === "CallExpression") {
            const result = isCallExpressionReactComponent(node);
            if (result === false) {
              nonComponentExports.push(node);
            } else if (result === "needName") {
              context.report({ messageId: "anonymousExport", node });
            } else {
              hasReactExport = true;
            }
          } else if (node.type === "ObjectExpression") {
            if (isExpressionReactComponent(node) === false) {
              nonComponentExports.push(node);
            } else {
              hasReactExport = true;
            }
          } else {
            nonComponentExports.push(node);
          }
        };
        for (const node of program.body) {
          if (node.type === "ExportAllDeclaration") {
            if (node.exportKind === "type") continue;
            hasExports = true;
            context.report({ messageId: "exportAll", node });
          } else if (node.type === "ExportDefaultDeclaration") {
            hasExports = true;
            const declaration = skipTSWrapper(node.declaration);
            if (declaration.type === "VariableDeclaration" || declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration" || declaration.type === "CallExpression" || allowCompoundComponents && declaration.type === "ObjectExpression") {
              handleExportDeclaration(declaration);
            }
            if (declaration.type === "Identifier") {
              handleExportIdentifier(declaration);
            }
            if (declaration.type === "ArrowFunctionExpression") {
              context.report({ messageId: "anonymousExport", node });
            }
          } else if (node.type === "ExportNamedDeclaration") {
            if (node.exportKind === "type") continue;
            const declaration = node.declaration ? skipTSWrapper(node.declaration) : null;
            if (declaration?.type === "TSDeclareFunction") continue;
            hasExports = true;
            if (declaration) handleExportDeclaration(declaration);
            for (const specifier of node.specifiers) {
              const identifier = specifier.exported.type === "Identifier" && specifier.exported.name === "default" ? specifier.local : specifier.exported;
              if (specifier.local.type === "Identifier") {
                const scope = context.sourceCode.getScope(node);
                const localName = specifier.local.name;
                const def = scope.variables.find((v) => v.name === localName)?.defs[0];
                if (def?.type === "ClassName") {
                  handleExportDeclaration(def.node);
                  continue;
                }
                if (def?.type === "Variable" && def.node.init !== null) {
                  handleExportIdentifier(identifier, def.node.init);
                  continue;
                }
              }
              handleExportIdentifier(identifier);
            }
          } else if (node.type === "VariableDeclaration") {
            for (const variable of node.declarations) {
              if (variable.id.type === "Identifier" && reactComponentNameRE.test(variable.id.name) && variable.init !== null && isExpressionReactComponent(variable.init) !== false) {
                localComponents.push(variable.id);
              }
            }
          } else if (node.type === "FunctionDeclaration") {
            if (reactComponentNameRE.test(node.id.name)) {
              localComponents.push(node.id);
            }
          } else if (node.type === "ImportDeclaration" && node.source.value === "react") {
            reactIsInScope = true;
          }
        }
        if (checkJS && !reactIsInScope) return;
        if (hasExports) {
          if (hasReactExport) {
            for (const node of nonComponentExports) {
              context.report({ messageId: "namedExport", node });
            }
            for (const node of reactContextExports) {
              context.report({ messageId: "reactContext", node });
            }
          } else if (localComponents.length > 0) {
            for (const node of localComponents) {
              context.report({ messageId: "localComponents", node });
            }
          }
        } else if (localComponents.length > 0) {
          for (const node of localComponents) {
            context.report({ messageId: "noExport", node });
          }
        }
      }
    };
  }
};
var skipTSWrapper = (node) => {
  if (node.type === "TSAsExpression" || node.type === "TSSatisfiesExpression" || node.type === "TSNonNullExpression" || node.type === "TSTypeAssertion" || node.type === "TSInstantiationExpression") {
    return node.expression;
  }
  return node;
};
var constantExportExpressions = /* @__PURE__ */ new Set([
  "Literal",
  // 1, "foo"
  "UnaryExpression",
  // -1
  "TemplateLiteral",
  // `Some ${template}`
  "BinaryExpression"
  // 24 * 60
]);

// src/index.ts
var rules = {
  "only-export-components": onlyExportComponents
};
var plugin = { rules };
var buildConfig = ({
  name,
  baseOptions
}) => (options) => ({
  name: `react-refresh/${name}`,
  plugins: { "react-refresh": plugin },
  rules: {
    "react-refresh/only-export-components": [
      "error",
      { ...baseOptions, ...options }
    ]
  }
});
var configs = {
  recommended: buildConfig({ name: "recommended", baseOptions: {} }),
  vite: buildConfig({
    name: "vite",
    baseOptions: { allowConstantExport: true, allowCompoundComponents: true }
  }),
  next: buildConfig({
    name: "next",
    baseOptions: {
      allowExportNames: [
        // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
        "experimental_ppr",
        "dynamic",
        "dynamicParams",
        "revalidate",
        "fetchCache",
        "runtime",
        "preferredRegion",
        "maxDuration",
        // https://nextjs.org/docs/app/api-reference/functions/generate-metadata
        "metadata",
        "generateMetadata",
        // https://nextjs.org/docs/app/api-reference/functions/generate-viewport
        "viewport",
        "generateViewport",
        // https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata
        "generateImageMetadata",
        // https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
        "generateSitemaps",
        // https://nextjs.org/docs/app/api-reference/functions/generate-static-params
        "generateStaticParams",
        // https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
        "instant",
        // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons#config-exports
        "contentType",
        "size"
      ]
    }
  })
};
var reactRefresh = { plugin, configs };
var index_default = {
  rules,
  configs: {
    recommended: configs.recommended(),
    vite: configs.vite(),
    next: configs.next()
  }
};
export {
  index_default as default,
  reactRefresh
};
