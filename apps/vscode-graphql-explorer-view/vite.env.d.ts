/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

interface PlainTextFile {
  plainText: string;
}

declare module '*.txt' {
  export = PlainTextFile;
}
