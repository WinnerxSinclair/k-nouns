//raw, raw input object to be validated
//errForm, a ref object, keys should be same name as schema keys
//schema, a zod schema
export const validate = (raw, errForm, schema) => {
  Object.keys(errForm.value).forEach(k => errForm.value[k] = []);
  const zodRes = schema.safeParse(raw);
  if(!zodRes.success){
    const { fieldErrors } = zodRes.error.flatten();
    Object.assign(errForm.value, fieldErrors);
  }
  return zodRes.success;
}


export const validateNoRender = (raw, schema) => {
  const zodRes = schema.safeParse(raw);
  return zodRes.success;
}