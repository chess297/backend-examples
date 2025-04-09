import dayjs from 'dayjs';

import { RESPONSE_CODE, RESPONSE_MSG } from '@/constants/enums';
import type { Response } from '@/types';

/**
 * @description: 统一返回体
 */
export const responseMessage = <T = any>(
  data: T,
  msg: string = RESPONSE_MSG.SUCCESS,
  code: number = RESPONSE_CODE.SUCCESS,
  details?: string[],
): Response<T> => {
  return { data, msg, code, details, timestamp: dayjs().valueOf() };
};
