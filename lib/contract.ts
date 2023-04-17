export type AbiFunctionReturnType<
  TAbi extends Abi,
  TFunctionName extends string
> = IsContractsFileMissing<
  any,
  AbiParametersToPrimitiveTypes<AbiFunctionOutputs<TAbi, TFunctionName>>[0]
>;
