import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
} from "react-aria-components";
import type { FieldValues } from "react-hook-form";
import type { BaseFormFieldProps } from "./field-types";
import { useFormFieldController } from "./useFormFieldController";

type TextInputType = "email" | "password" | "search" | "tel" | "text" | "url";

type TextInputMode =
  "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";

export type TextInputFieldProps<TFieldValues extends FieldValues> =
  BaseFormFieldProps<TFieldValues> & {
    type?: TextInputType;
    inputMode?: TextInputMode;
    autoComplete?: string;
    placeholder?: string;
    maxLength?: number;
    isDisabled?: boolean;
    isReadOnly?: boolean;
  };

export function TextInputField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  isRequired = false,
  validateOn = "blur",
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  maxLength,
  isDisabled = false,
  isReadOnly = false,
}: TextInputFieldProps<TFieldValues>) {
  const {
    errorMessage,
    fieldName,
    fieldValue,
    focusTargetRef,
    handleBlur,
    isInvalid,
    setValue,
  } = useFormFieldController<TFieldValues>({ name, validateOn });
  const value = typeof fieldValue === "string" ? fieldValue : "";

  return (
    <TextField
      name={fieldName}
      value={value}
      type={type}
      inputMode={inputMode}
      autoComplete={autoComplete}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isInvalid={isInvalid}
      validationBehavior="aria"
      onBlur={handleBlur}
      onChange={setValue}
      className="w-full"
    >
      <Label className="mb-1.5 block text-sm font-semibold text-foreground">
        {label}
        {isRequired && (
          <>
            <span className="text-danger" aria-hidden="true">
              {" "}
              *
            </span>
            <span className="sr-only"> (verplicht)</span>
          </>
        )}
      </Label>

      {description && (
        <Text
          slot="description"
          className="mb-2 block text-sm text-muted-foreground"
        >
          {description}
        </Text>
      )}

      <Input
        ref={focusTargetRef}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`block w-full rounded-control border bg-surface px-3.5 py-2.5 text-base text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground ${
          isInvalid
            ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/10"
            : "border-border hover:border-muted-foreground/60 focus:border-primary focus:ring-4 focus:ring-primary-soft"
        }`}
      />

      {isInvalid && (
        <FieldError className="mt-1.5 text-sm font-medium text-danger">
          {errorMessage}
        </FieldError>
      )}
    </TextField>
  );
}
