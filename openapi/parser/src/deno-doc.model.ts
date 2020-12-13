export namespace DenoDoc {
  export interface RootDef {
    kind: Kind;
    name: string;
    location: Location;
    jsDoc: string;
    classDef: ClassDef;
    typeAliasDef: TypeAliasDef;
    variableDef: VariableDef;
    importDef: ImportDef;
    interfaceDef: InterfaceDef;
  }

  export interface ImportDef {
    src: string;
    imported: string;
    def: RootDef[];
  }

  export type Kind =
    | "array"
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
  }

  export interface Method {
    jsDoc: string;
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
    jsDoc?: any;
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
}
