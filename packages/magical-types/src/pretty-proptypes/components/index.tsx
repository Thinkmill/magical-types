// @flow
import { ComponentType } from "react";
import Indent from "./Indent";
import Outline from "./Outline";
import Required from "./Required";
import Description from "./Description";
import Button from "./Button";
import Type, { StringType, TypeMeta, FunctionType } from "./Type";

const components = {
  Indent,
  Outline,
  Required,
  Type,
  StringType,
  TypeMeta,
  Description,
  Button,
  FunctionType
};

export default components;

export type Components = {
  Indent: typeof Indent;
  Outline: typeof Outline;
  Required: typeof Required;
  Type: typeof Type;
  StringType: typeof StringType;
  TypeMeta: typeof TypeMeta;
  Description: typeof Description;
  Button: typeof Button;
  FunctionType: typeof FunctionType;
};
