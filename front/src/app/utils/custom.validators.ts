import { AbstractControl } from '@angular/forms';

function validate(regex: RegExp, control: AbstractControl): any {
  const value = control.value ? control.value.toString() : '';

  if (!regex.test(value)) {
    return { incorrect: {} };
  }

  return null;
}

export function ValidateURL(control: AbstractControl) {
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  return validate(regex, control);
}

export function ValidateIPAddress(control: AbstractControl) {
  const regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
  return validate(regex, control);
}

export function ValidateMail(control: AbstractControl) {
  const regex = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;
  return validate(regex, control);
}

export function ValidateNumbers(control: AbstractControl) {
  const regex = /^\d+$/;
  return validate(regex, control);
}

export function ValidateDecimal(control: AbstractControl) {
  const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
  return validate(regex, control);
}

export function ValidateSelect(control: AbstractControl) {
  const value = control.value > 0 ? null : { incorrect: {} };
  return value;
}
