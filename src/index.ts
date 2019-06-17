import { getElement } from "@stencil/core";
import { ComponentInstance } from "@stencil/core/dist/declarations";
import { BUILD } from "@stencil/core/build-conditionals";

declare type MyDecoratorResult = (
  target: ComponentInstance,
  methodName: string
) => void;

declare interface MyDecoratorOptions {
  // some parameters that MyDecorator can have
  // can be used like @MyDecorator({exampleParam: "test"})
  exampleParam?: string
}

const ClickOutsideOptionsDefaults: MyDecoratorOptions = {
  exampleParam: "test",
};

/**
 * This function is a implementation of StencilJs decorator.
 * @example
```
@MyDecorator()
callback() {
  // This is a method in StencilJs component
}
```
 *
 * You can also use decorator on property.
 * @example
```
@MyDecorator() @Prop() myProp;
  // myProp is a property in StencilJs component  
*/
export function MyDecorator(
  opt: MyDecoratorOptions = ClickOutsideOptionsDefaults
): MyDecoratorResult {
  return (proto: ComponentInstance, methodName: string) => {
    
    // this is to resolve the 'compiler optimization issue':
    // lifecycle events not being called when not explicitly declared in at least one of components from bundle
    BUILD.cmpDidLoad = true;
    BUILD.cmpDidUnload = true;

    // You can also hijack other lifecycle methods
    const { componentDidLoad, componentDidUnload } = proto;

    proto.componentDidLoad = function() {
      const host = getElement(this);  // HTMLElement of ComponentInstance - proto
      const method = this[methodName];  // method from ComponentInstance annotated by @MyDecorator. Prop can be done in the same way
      // Your decorating code goes here.
      return componentDidLoad && componentDidLoad.call(this);  //returning original result of componentDidLoad if defined in ComponentInstance
    };

    proto.componentDidUnload = function() {
      // Your decorating code goes here. Cleanup!
      return componentDidUnload && componentDidUnload.call(this);  //returning original result of componentDidLoad if defined in ComponentInstance
    };
  };
}
