import type { FieldPathByValue, FieldValues } from "react-hook-form";

export type FieldValidationMode = "blur" | "change";

export type StringFieldPath<TFieldValues extends FieldValues> =
  FieldPathByValue<TFieldValues, string>;

export type BaseFormFieldProps<TFieldValues extends FieldValues> = {
  name: StringFieldPath<TFieldValues>;
  label: string;
  description?: string;
  isRequired?: boolean;
  validateOn?: FieldValidationMode;
};
