import emailMask from 'text-mask-addons/dist/emailMask';

export class Masks {
  public readonly CURRENCY = {
    regex: '^\s*(?:[1-9]\d{0,2}(?:\.\d{3})*|0)(?:,\d{1,2})?$'
  };
  public readonly EMAIL = emailMask;
  public readonly CPF = {
    mask: [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    placeholderChar: '\u2002'
  };
  public readonly CNPJ = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/],
    placeholderChar: '\u2002'
  };
  public readonly PHONE = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    placeholderChar: '\u2002'
  };
  public readonly CELLPHONE = {
    mask: ['(', /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
    placeholderChar: '\u2002'
  };
  public readonly ZIPCODE = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/],
    placeholderChar: '\u2002'
  };
  public readonly CODESMS = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    placeholderChar: '\u2002'
  };

  public getOnlyDigits(value) {
    if (value)
      return value.trim().match(/\d/g).join('');
    return '';
  }
}
