import {
  deepmergeCustom,
  type DeepMergeLeaf,
  type DeepMergeMergeFunctionsURIs
} from "deepmerge-ts";

export const partialDeepmerge = deepmergeCustom<{
  DeepMergeOthersURI: "DeepMergeLeafNoUndefinedOverrideURI";
}>({
  mergeOthers: (values, utils) =>
    utils.defaultMergeFunctions.mergeOthers(
      values.filter((v) => v !== undefined).concat(utils),
    )
});

export const deepmergePartial = deepmergeCustom({
  mergeOthers: (values, utils, _meta) => {
    if (typeof values === 'undefined') {
      return utils.actions.skip
    }

    return utils.actions.defaultMerge
  },
})

export const override = <T>(a: T, ...rest: unknown[]): T => {
  return deepmergePartial(a, ...rest) as unknown as T
}


declare module "deepmerge-ts" {
  interface DeepMergeMergeFunctionURItoKind<
    Ts extends ReadonlyArray<unknown>,
    MF extends DeepMergeMergeFunctionsURIs,
    in out M
  > {
    readonly DeepMergeLeafNoUndefinedOverrideURI: DeepMergeLeafNoUndefinedOverride<
      Ts
    >;
  }
}

type DeepMergeLeafNoUndefinedOverride<
  Ts extends ReadonlyArray<unknown>
> = DeepMergeLeaf<FilterOutUnderfined<Ts>>;

type FilterOutUnderfined<
  T extends ReadonlyArray<unknown>
> = FilterOutUnderfinedHelper<T, []>;

type FilterOutUnderfinedHelper<
  T extends ReadonlyArray<unknown>,
  Acc extends ReadonlyArray<unknown>
> = T extends readonly []
  ? Acc
  : T extends readonly [infer Head, ...(infer Rest)]
  ? Head extends undefined
    ? FilterOutUnderfinedHelper<Rest, Acc>
    : FilterOutUnderfinedHelper<Rest, [...Acc, Head]>
  : T;
