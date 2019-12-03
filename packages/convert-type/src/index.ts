import * as typescript from "typescript";
import { MagicalNode, Property, TypeParameterNode } from "@magical-types/types";
import { InternalError } from "@magical-types/errors";

let wrapInCache = <Arg extends object, Return>(
  arg: (type: Arg, path: Array<string | number>) => Return
) => {
  let cache = new WeakMap<Arg, Return>();
  return (type: Arg, path: Array<string | number>): Return => {
    let cachedNode = cache.get(type);
    if (cachedNode !== undefined) {
      return cachedNode;
    }
    let obj = {} as Return;
    cache.set(type, obj);
    try {
      let node = arg(type, path);
      Object.assign(obj, node);
      return obj;
    } catch (err) {
      debugger;
      if (
        !err.message.startsWith(
          "The following error occurred while trying to stringify"
        )
      ) {
        err.message = `The following error occurred while trying to stringify the following path: ${path}: ${err.message}`;
      }
      throw err;
    }
  };
};

let convertParameter = (
  parameter: typescript.Symbol,
  path: Array<string | number>,
  typeChecker: typescript.TypeChecker
) => {
  let declaration = parameter.valueDeclaration || parameter.declarations[0];
  if (!typescript.isParameter(declaration)) {
    throw new InternalError(
      "expected node to be a parameter declaration but it was not"
    );
  }

  if (typeChecker.isOptionalParameter(declaration) && declaration.type) {
    return {
      required: false,
      name: parameter.name,
      type: convertType(
        typeChecker.getTypeFromTypeNode(declaration.type),
        path.concat("getParameters()", parameter.name)
      )
    };
  }

  let type = typeChecker.getTypeOfSymbolAtLocation(parameter, declaration);
  return {
    required: true,
    name: parameter.name,
    type: convertType(type, path.concat("getParameters()", parameter.name))
  };
};

let convertSignature = wrapInCache(
  (callSignature: typescript.Signature, path: Array<string | number>) => {
    let returnType = callSignature.getReturnType();
    let typeChecker = getTypeChecker(returnType);
    let typeParameters = callSignature.getTypeParameters() || [];
    let parameters = callSignature
      .getParameters()
      .map(param => convertParameter(param, path, typeChecker));

    return {
      type: "Signature",
      return: convertType(returnType, path.concat("getReturnType()")),
      parameters,
      typeParameters: typeParameters.map(
        (x, index) =>
          convertType(
            x,
            path.concat("typeParameters", index)
          ) as TypeParameterNode
      )
    } as const;
  }
);

function convertProperty(
  symbol: typescript.Symbol,
  path: Array<string | number>,
  typeChecker: typescript.TypeChecker
): Property {
  let key = symbol.getName();
  let type: typescript.Type;
  if (
    symbol.valueDeclaration ||
    (symbol.declarations && symbol.declarations[0])
  ) {
    let declaration = symbol.valueDeclaration || symbol.declarations[0];
    type = typeChecker.getTypeOfSymbolAtLocation(symbol, declaration);
  } else if ((symbol as any).type) {
    type = (symbol as any).type;
  } else {
    let x = symbolFlagsToString(symbol);
    debugger;
    throw new InternalError("type not found for property");
  }

  let isRequired = !(symbol.flags & typescript.SymbolFlags.Optional);
  // TODO: this could be better

  let value = convertType(type, path.concat("getProperties()", key));

  // i know this is technically wrong but this is better than every optional thing
  // being a union of undefined and the type
  // ideally, we would have the type of the property without undefined unless it's actually a union of undefined and the type
  if (!isRequired && value.type === "Union") {
    value.types = value.types.filter(
      x => !(x.type === "Intrinsic" && x.value === "undefined")
    );

    if (
      value.types.length === 2 &&
      value.types.every(
        x =>
          x.type === "Intrinsic" && (x.value === "true" || x.value === "false")
      )
    ) {
      value = {
        type: "Intrinsic",
        value: "boolean"
      };
    } else if (value.types.length === 1) {
      value = value.types[0];
    }
  }

  let thing = typescript.displayPartsToString(
    symbol.getDocumentationComment(typeChecker)
  );
  return {
    description: thing,
    required: isRequired,
    key,
    value: value
  };
}

function getNameForType(type: typescript.Type): string | null {
  if (type.symbol) {
    let name = type.symbol.getName();
    if (name !== "__type") {
      return name;
    }
  }
  if (type.aliasSymbol) {
    return type.aliasSymbol.getName();
  }
  return null;
}

function symbolFlagsToString(type: typescript.Symbol) {
  return Object.keys(typescript.SymbolFlags).filter(
    // @ts-ignore
    flagName => type.flags & typescript.SymbolFlags[flagName]
  );
}

function typeFlagsToString(type: typescript.Type) {
  return Object.keys(typescript.TypeFlags).filter(
    // @ts-ignore
    flagName => type.flags & typescript.TypeFlags[flagName]
  );
}

function getTypeChecker(type: typescript.Type) {
  return (type as any).checker as typescript.TypeChecker;
}

export let convertType = wrapInCache(
  (type: typescript.Type, path: Array<string | number>): MagicalNode => {
    if (!type) {
      throw new InternalError(`falsy type at path: ${path}`);
    }

    if (
      (type as any).intrinsicName &&
      (type as any).intrinsicName !== "error"
    ) {
      return {
        type: "Intrinsic",
        value: (type as any).intrinsicName
      };
    }

    // i think this is done badly
    if (type.symbol && type.symbol.escapedName === "Promise") {
      return {
        type: "Promise",
        value: convertType(
          (type as any).typeArguments[0],
          path.concat("typeArguments", 0)
        )
      };
    }

    if (type.isStringLiteral()) {
      return {
        type: "StringLiteral",
        value: type.value
      };
    }
    if (type.isNumberLiteral()) {
      return {
        type: "NumberLiteral",
        value: type.value
      };
    }
    if (type.isUnion()) {
      let types = type.types.map((type, index) =>
        convertType(type, path.concat("types", index))
      );
      if (
        types.filter(
          x =>
            x.type === "Intrinsic" &&
            (x.value === "false" || x.value === "true")
        ).length === 2
      ) {
        let allTypes = types;
        types = [];
        let needsToAddBoolean = true;
        for (let type of allTypes) {
          if (
            type.type === "Intrinsic" &&
            (type.value === "true" || type.value === "false")
          ) {
            if (needsToAddBoolean) {
              needsToAddBoolean = false;
              types.push({ type: "Intrinsic", value: "boolean" });
            }
          } else {
            types.push(type);
          }
        }
      }

      return {
        type: "Union",
        name: getNameForType(type),
        types
      };
    }
    if (type.isIntersection()) {
      return {
        type: "Intersection",
        types: type.types.map((type, index) =>
          convertType(type, path.concat("types", index))
        )
      };
    }
    let typeChecker = getTypeChecker(type);

    if ((typeChecker as any).isArrayType(type)) {
      // TODO: fix ReadonlyArray
      return {
        type: "Array",
        value: convertType(
          (type as any).typeArguments[0],
          path.concat("typeArguments", 0)
        )
      };
    }

    if ((typeChecker as any).isTupleType(type)) {
      return {
        type: "Tuple",
        value: ((type as any) as {
          typeArguments: Array<typescript.Type>;
        }).typeArguments.map((x, index) =>
          convertType(x, path.concat("typeArguments", index))
        )
      };
    }

    if (type.isClass()) {
      return {
        type: "Class",
        name: type.symbol ? type.symbol.getName() : null,
        typeParameters: (type.typeParameters || []).map((x, index) =>
          convertType(x, path.concat("typeParameters", index))
        ),
        thisNode: type.thisType
          ? convertType(type.thisType, path.concat("thisType"))
          : null,
        properties: type
          .getProperties()
          // this is most definitely wrong but it works
          .filter(symbol => symbol.getName() !== "prototype")
          .map((symbol, index) => {
            return convertProperty(symbol, path, typeChecker);
          })
      };
    }

    if (type.flags & typescript.TypeFlags.Object) {
      return {
        type: "Object",
        name: getNameForType(type),
        aliasTypeArguments: (type.aliasTypeArguments || []).map(
          (type, index) => {
            return convertType(type, path.concat("aliasTypeArguments", index));
          }
        ),
        constructSignatures: type
          .getConstructSignatures()
          .map((constructSignature, index) =>
            convertSignature(
              (constructSignature as any).target
                ? ((constructSignature as any) as {
                    target: typescript.Signature;
                  }).target
                : constructSignature,
              path.concat("getConstructSignatures()", index)
            )
          ),
        callSignatures: type
          .getCallSignatures()
          .map((callSignature, index) =>
            convertSignature(
              (callSignature as any).target
                ? ((callSignature as any) as { target: typescript.Signature })
                    .target
                : callSignature,
              path.concat("getCallSignatures()", index)
            )
          ),
        properties: type
          .getProperties()
          // this is most definitely wrong but it works
          .filter(symbol => symbol.getName() !== "prototype")
          .map((symbol, index) => {
            return convertProperty(symbol, path, typeChecker);
          })
      };
    }

    if (type.isTypeParameter()) {
      return {
        type: "TypeParameter",
        value: type.symbol.getName()
      };
    }

    // @ts-ignore
    if (type.flags & typescript.TypeFlags.Index) {
      let indexType = type as typescript.IndexType;
      return convertType(indexType.type, path.concat("type"));
    }

    // // @ts-ignore
    // if (type.flags & typescript.TypeFlags.Substitution) {
    //   // let substitutionType = type as typescript.SubstitutionType;
    //   // return convertType(substitutionType.type, path.concat("type"));
    // }

    // @ts-ignore
    if (type.flags & typescript.TypeFlags.IndexedAccess) {
      let indexedAccessType = type as typescript.IndexedAccessType;

      return {
        type: "IndexedAccess",
        object: convertType(
          indexedAccessType.objectType,
          path.concat("object")
        ),
        index: convertType(indexedAccessType.indexType, path.concat("index"))
      };
    }
    // @ts-ignore
    if (type.flags & typescript.TypeFlags.Conditional) {
      let conditionalType = type as typescript.ConditionalType;
      return {
        type: "Conditional",
        check: convertType(conditionalType.checkType, path.concat("checkType")),
        extends: convertType(
          conditionalType.extendsType,
          path.concat("extendsType")
        ),
        false: convertType(
          (conditionalType as any).root.falseType,
          path.concat("falseType")
        ),
        true: convertType(
          (conditionalType as any).root.trueType,
          path.concat("trueType")
        )
      };
    }
    let flags = typeFlagsToString(type);
    if ((type as any).flags & typescript.TypeFlags.Substitution) {
      let substitutionType: typescript.SubstitutionType = type;
      return convertType(
        substitutionType.substitute,
        path.concat("substitute")
      );
    }
    if ((type as any).flags & typescript.TypeFlags.UniqueESSymbol) {
      return {
        type: "Symbol",
        name: (type as typescript.UniqueESSymbolType).escapedName.toString()
      };
    }
    debugger;

    throw new InternalError(
      `Could not stringify type with flags: ${JSON.stringify(
        flags,
        null,
        2
      )} and path: ${path}`
    );
  }
);
