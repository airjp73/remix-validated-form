import { FormEvent, LegacyRef, Ref } from "react";
import {
  GenericObject,
  getCheckboxChecked,
  getNextNativeValue,
  getRadioChecked,
  isEvent,
  isFormControl,
} from "@rvf/core";

const omitBy = <T extends GenericObject>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => !predicate(value, key)),
  ) as Partial<T>;

export type CreateGetInputPropsOptions = {
  onChange: (value: unknown) => void;
  onBlur: () => void;
  defaultValue?: any;
  name: string;
  createRef: () => Ref<HTMLElement>;
  formId?: string;
  getCurrentValue: () => unknown;
};

type HandledProps = "name" | "defaultValue" | "defaultChecked";
type Callbacks = "onChange" | "onBlur";

export type MinimalInputProps = {
  onChange?: ((...args: any[]) => void) | undefined;
  onBlur?: ((...args: any[]) => void) | undefined;
  defaultValue?: any;
  defaultChecked?: boolean | undefined;
  name?: string | undefined;
  type?: string | undefined;
  ref?: LegacyRef<any>;
  value?: string | number | readonly string[];
  form?: string;
};

export type ValidInputPropsValues = string | string[] | number | boolean;

export type GetInputPropsParam<T extends MinimalInputProps> = Omit<
  T,
  HandledProps | Callbacks
> &
  Partial<Pick<T, Callbacks>>;

export type GetInputProps = <T extends MinimalInputProps>(
  props?: GetInputPropsParam<T>,
) => T;

export const createGetInputProps = ({
  onChange,
  onBlur,
  defaultValue,
  name,
  createRef,
  formId,
  getCurrentValue,
}: CreateGetInputPropsOptions): GetInputProps => {
  return <T extends MinimalInputProps>(props = {} as any) => {
    const rvfRef = createRef();
    const inputProps: MinimalInputProps = {
      ...props,
      form: formId,
      onChange: (...args: unknown[]) => {
        props?.onChange?.(...args);

        if (!isEvent(args[0])) {
          onChange(args[0]);
          return;
        }

        const target = (args[0] as FormEvent).target;
        if (!isFormControl(target)) {
          onChange(args[0]);
          return;
        }

        const nextValue = getNextNativeValue({
          element: target,
          currentValue: getCurrentValue(),
        });
        onChange(nextValue);
      },
      onBlur: (...args: unknown[]) => {
        props?.onBlur?.(...args);
        onBlur();
      },
      name,
      ref: (element) => {
        if (typeof props.ref === "function") props.ref(element);
        else if (props.ref) props.ref.current = element;

        if (typeof rvfRef === "function") rvfRef(element);
        else if (rvfRef) (rvfRef as any).current = element;
      },
    };

    if (props.type === "checkbox") {
      inputProps.defaultChecked = getCheckboxChecked(props.value, defaultValue);
    } else if (props.type === "radio") {
      inputProps.defaultChecked = getRadioChecked(props.value, defaultValue);
    } else if (props.value === undefined && inputProps.type !== "file") {
      // We should only set the defaultValue if the input is uncontrolled.
      inputProps.defaultValue = defaultValue;
    }

    if (props.type === "file" && !!defaultValue) {
      console.warn("File inputs cannot have a default value.");
    }

    return omitBy(inputProps, (value) => value === undefined) as T;
  };
};
