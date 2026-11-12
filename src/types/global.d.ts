/**
 * Declaraciones globales de tipos para TypeScript.
 * Permite que editores (VS Code, Cursor, WebStorm) reconozcan
 * importaciones de archivos CSS y estáticos sin arrojar el error ts(2307).
 */
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}
