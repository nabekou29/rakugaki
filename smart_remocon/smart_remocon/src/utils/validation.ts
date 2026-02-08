import { Errors, Values } from '../interfaces/form';

import format from 'string-format';
import { validationMessage } from '../constants/message';

/** バリデーション */
interface Validator {
  validator: (value: string) => boolean;
  message: string;
}

/** 必須 */
export const required: Validator = {
  message: validationMessage.required,
  validator: (value: string) => value !== '',
};

/** 整数 */
export const isInteger: Validator = {
  message: validationMessage.notNaturalNumber,
  validator: (value: string): boolean => Number.isInteger(Number(value)),
};

/** 自然数 */
export const isNaturalNumber: Validator = {
  message: validationMessage.notNaturalNumber,
  validator: (value: string): boolean =>
    isInteger.validator(value) && Number(value) >= 0,
};

/** E-mail */
export const isEmail: Validator = {
  message: validationMessage.notEmail,
  validator: (value: string): boolean =>
    !value || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value),
};

/** 最大文字数 */
export const maxLength = (max: number): Validator => ({
  message: format(validationMessage.maxLength, max.toString()),
  validator: (value: string): boolean => !value || value.length <= max,
});

/** 最大桁数 */
export const maxDigits = (max: number): Validator => ({
  message: format(validationMessage.maxDigits, max.toString()),
  validator: (value: string): boolean =>
    maxLength(max).validator(value) && isInteger.validator(value),
});

/**
 * バリデーション関数を作成する
 * @param validations バリデーションの一覧
 */
export const createValidator = (validations: {
  [key: string]: Validator[];
}) => (values: Values): Errors => {
  const errors: Errors = {};
  Object.entries(validations).forEach(([name, validators]) => {
    validators.some(({ validator, message }: Validator) => {
      if (!validator(values[name] || '')) {
        errors[name] = message;
        return true;
      }
      return false;
    });
  });
  return errors;
};
