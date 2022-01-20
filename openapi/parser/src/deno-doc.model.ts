export namespace DenoDoc {
  export interface RootDef {
    kind: Kind;
    name: string;
    location: Location;
    jsDoc?: JsDoc;
    classDef: ClassDef;
    typeAliasDef: TypeAliasDef;
    variableDef: VariableDef;
    importDef: ImportDef;
    interfaceDef: InterfaceDef;
    enumDef: EnumDef;
  }

  export interface ImportDef {
    src: string;
    imported: string;
    def?: RootDef[];
  }

  export interface EnumDef {
    members: EnumMember[];
  }

  export interface EnumMember {
    name: string;
    jsDoc?: JsDoc;
  }

  export type Kind =
    | "array"
    | "enum"
    | "keyword"
    | "import"
    | "interface"
    | "class"
    | "typeRef"
    | "function"
    | "method"
    | "identifier"
    | "fnOrConstructor";

  export interface TypeAliasDef {
    tsType: TsType;
    typeParams: TypeParam[];
  }

  export interface VariableDef {
    tsType: TsType;
    kind: Kind;
  }

  export interface InterfaceDef {
    extends: any[];
    methods: Method[];
    properties: Property[];
    callSignatures: any[];
    indexSignatures: any[];
    typeParams: TypeParam[];
  }

  export interface Location {
    filename: string;
    line: number;
    col: number;
  }

  export interface ClassDef {
    isAbstract: boolean;
    constructors: any[];
    properties: Property[];
    indexSignatures: any[];
    methods: Method[];
    extends?: any;
    implements: any[];
    typeParams: any[];
    superTypeParams: any[];
    decorators: DecortorDef[];
  }

  export interface DecortorDef {
    name: string;
    location: Location;
  }

  export interface Method {
    jsDoc?: JsDoc;
    accessibility: string;
    optional: boolean;
    isAbstract: boolean;
    isStatic: boolean;
    name: string;
    kind: Kind;
    functionDef: FunctionDef;
    location: Location;
  }

  export interface FunctionDef {
    params: Param[];
    returnType: ReturnType;
    isAsync: boolean;
    isGenerator: boolean;
    typeParams: TypeParam[];
  }

  export interface ReturnType {
    repr: string;
    kind: Kind;
    typeRef: TypeRef;
    array: ArrayDef;
    keyword: string;
    union: Union[];
  }

  export interface Union {
    repr: string;
    kind: Kind;
    typeRef: TypeRef;
    keyword: string;
    array: ArrayDef;
  }

  export interface ArrayDef {
    repr: string;
    kind: Kind;
    typeRef: TypeRef;
  }

  export interface TypeRef {
    typeParams: TypeParam[];
    typeName: string;
  }

  export interface TypeParam {
    name: string;
  }

  export interface Param {
    kind: Kind;
    name: string;
    optional: boolean;
    tsType: TsType;
    left: Left;
    right: string;
  }

  export interface Left {
    kind: Kind;
    name: string;
    optional: boolean;
    tsType: TsType;
  }

  export interface Property {
    jsDoc?: JsDoc;
    tsType: TsType;
    readonly: boolean;
    accessibility: string;
    optional: boolean;
    isAbstract: boolean;
    isStatic: boolean;
    name: string;
    location: Location;
  }

  export interface TsType {
    repr: string;
    kind: Kind;
    literal: Literal;
    array: TsType;
    typeRef: TypeRef;
  }

  export interface Literal {
    kind: Kind;
    string: string;
  }

  export interface JsDoc {
    doc?: string;
    tags?: JsDocTag[];
  }

  export type JsDocTagKind =
    | "callback"
    | "constructor"
    | "deprecated"
    | "enum"
    | "example"
    | "extends"
    | "module"
    | "param"
    | "public"
    | "private"
    | "property"
    | "protected"
    | "readonly"
    | "return"
    | "template"
    | "this"
    | "typedef"
    | "type"
    | "unsupported";

  export type JsDocTag =
    | JsDocTagOnly
    | JsDocTagDoc
    | JsDocTagNamed
    | JsDocTagTyped
    | JsDocTagNamedTyped
    | JsDocTagParam
    | JsDocTagReturn
    | JsDocTagUnsupported;

  export interface JsDocTagBase {
    kind: JsDocTagKind;
  }

  export interface JsDocTagOnly extends JsDocTagBase {
    kind: "constructor" | "public" | "private" | "protected" | "readonly" | "example";
  }

  export interface JsDocTagDoc extends JsDocTagBase {
    kind: "deprecated" | "example";
    doc?: string;
  }

  export interface JsDocTagNamed extends JsDocTagBase {
    kind: "callback" | "template";
    name: string;
    doc?: string;
  }

  export interface JsDocTagTyped extends JsDocTagBase {
    kind: "enum" | "extends" | "this" | "type";
    type: string;
    doc?: string;
  }

  export interface JsDocTagNamedTyped extends JsDocTagBase {
    kind: "property" | "typedef";
    name: string;
    type: string;
    doc?: string;
  }

  export interface JsDocTagParam extends JsDocTagBase {
    kind: "param";
    name: string;
    type?: string;
    doc?: string;
  }

  export interface JsDocTagReturn extends JsDocTagBase {
    kind: "return";
    type?: string;
    doc?: string;
  }

  export interface JsDocTagUnsupported extends JsDocTagBase {
    kind: "unsupported";
    value: string;
  }
}
