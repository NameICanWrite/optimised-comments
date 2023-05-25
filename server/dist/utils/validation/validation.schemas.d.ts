import Joi from "joi";
declare const validationSchemas: {
    [x: string]: Joi.ObjectSchema<any>;
    signup: Joi.ObjectSchema<any>;
    login: Joi.ObjectSchema<any>;
    withEmail: Joi.ObjectSchema<any>;
    resetPassword: Joi.ObjectSchema<any>;
};
export default validationSchemas;
