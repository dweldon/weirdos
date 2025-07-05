import env from 'env-var';

export const PORT = env.get('PORT').default('3000').asPortNumber();

const NODE_ENV = env
  .get('NODE_ENV')
  .required()
  .asEnum(['production', 'development']);

export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';
