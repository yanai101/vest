import type { State, UseState } from 'vast';
import { nestedArray } from 'vest-utils';

import VestTest from 'VestTest';
import { OptionalFieldDeclaration } from 'optionalFields';
import type { SuiteResult } from 'produceSuiteResult';

export default function createStateRef(
  state: State,
  { suiteId, suiteName }: { suiteId: string; suiteName?: void | string }
): StateRef {
  return {
    optionalFields: state.registerStateKey<OptionalFields>(() => ({})),
    suiteId: state.registerStateKey<string>(suiteId),
    suiteName: state.registerStateKey<SuiteName>(suiteName),
    testCallbacks: state.registerStateKey<TestCallbacks>(() => ({
      fieldCallbacks: {},
      doneCallbacks: [],
    })),
    testObjects: state.registerStateKey<TestObjects>(prev => {
      return {
        prev: prev ? prev.current : [],
        current: [] as VestTests,
      };
    }),
  };
}

export type StateRef = {
  optionalFields: UseState<OptionalFields>;
  suiteId: UseState<string>;
  suiteName: UseState<SuiteName>;
  testCallbacks: UseState<TestCallbacks>;
  testObjects: UseState<TestObjects>;
};

type StateKeys = keyof StateRef;

type OptionalFields = Record<string, OptionalFieldDeclaration>;

export type StateKey<T extends StateKeys> = ReturnType<StateRef[T]>;
export type StateValue<T extends StateKeys> = StateKey<T>[0];
export type StateSetter<T extends StateKeys> = StateKey<T>[1];

type SuiteName = string | void;

type TestCallbacks = {
  fieldCallbacks: Record<string, Array<(res: SuiteResult) => void>>;
  doneCallbacks: Array<(res: SuiteResult) => void>;
};

type TestObjects = {
  prev: VestTests;
  current: VestTests;
};

export type VestTests = nestedArray.NestedArray<VestTest>;
