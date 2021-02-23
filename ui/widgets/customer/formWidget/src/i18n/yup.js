import * as Yup from 'yup';

// eslint-disable-next-line import/prefer-default-export
export const setYupLocale = translateFn => {
  const yupLocale = {
    mixed: {
      required: ({ path }) =>
        translateFn('validation.required', { field: translateFn(`entities.customer.${path}`) }),
    },
  };
  Yup.setLocale(yupLocale);
};
