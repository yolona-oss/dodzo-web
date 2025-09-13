import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic'
/***
 * @deprecated Now all routes are public and role based instead
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
