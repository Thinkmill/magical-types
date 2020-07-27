import React, {
  ReactNode,
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  Ref,
  forwardRef,
} from "react";

type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<
    SVGElementTagNameMap,
    Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
  >;

type AsProp<Comp extends ElementType> = {
  as?: Comp;
  ref?: Ref<
    Comp extends keyof ElementTagNameMap
      ? ElementTagNameMap[Comp]
      : Comp extends new (...args: any) => any
      ? InstanceType<Comp>
      : undefined
  >;
} & Omit<ComponentPropsWithoutRef<Comp>, "as">;

type CompWithAsProp<Props, DefaultElementType extends ElementType> = <
  Comp extends ElementType = DefaultElementType
>(
  props: AsProp<Comp> & Props
) => ReactElement;

const forwardRefWithAs = <DefaultElementType extends ElementType, BaseProps>(
  render: (
    props: BaseProps & { as?: ElementType },
    ref: React.Ref<any>
  ) => Exclude<ReactNode, undefined>
): CompWithAsProp<BaseProps, DefaultElementType> => {
  // @ts-ignore
  return forwardRef(render);
};

type Props = {
  children?: ReactNode;
};

export const VisuallyHidden = forwardRefWithAs<"span", Props>(
  ({ as: Tag = "span", ...props }, ref) => {
    return <Tag ref={ref} style={visuallyHiddenStyles} {...props} />;
  }
);

export const visuallyHiddenStyles = {
  border: 0,
  clip: "rect(0, 0, 0, 0)",
  height: 1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
} as const;
