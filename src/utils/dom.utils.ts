type styleType = Omit<Partial<CSSStyleDeclaration>, 'length' | 'parentRule'>
export const applyStyle = (element: HTMLElement, styles: styleType) => {
  Object.keys(styles).forEach((styleProps) => {
    // @ts-ignore
    element.style[styleProps as keyof styleType] = styles[styleProps];
  })
}
const test = document.getElementById('test');
if (test) {

  applyStyle(test, {display: "block"})
}