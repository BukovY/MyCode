import { Rule } from "antd/lib/form";
import { GostinicySelectType } from "types/App.types";
import { OptionType } from "types/Global.types";
import { WbTourists } from "types/WbJournal.types";

export type FieldType =
  | "string"
  | "number"
  | "select"
  | "multiSelect"
  | "selectWithOptions"
  | "selectWithOptionsMultiple"
  | "boolean"
  | "date"
  | "gostinicy"
  | "dictionaryPrices"
  | "textArea"
  | "arrayString"
  | "wbTourists"
  | "program"
  | "start"
  | "price"
  | "location"
  | "services"
  | "richText";

export type FormFieldOptions = {
  displayOnFront?: boolean;
  dictionary?: string[];
  optionTypeDictionary?: OptionType[];
};

type FormValueType =
  | string
  | string[]
  | OptionType
  | OptionType[]
  | number
  | undefined
  | GostinicySelectType[]
  | WbTourists[]
  | boolean
  | { title: string; price: number }[];

export type FormFieldType = {
  name: string;
  type: FieldType;
  options: FormFieldOptions;
  label: string;
  value?: FormValueType;
  placeholder?: string;
  rules?: Rule[];
  helper?: string;
};

export type FormValues = Record<string, FormValueType>;

export type FormProps = {
  config: FormFieldType[];
  onSubmit: (val: FormValues) => void;
  title?: string;
  description?: string;
  customButton?: {
    isDanger?: boolean;
    text?: string;
    isDisabled?: boolean;
  };
};
