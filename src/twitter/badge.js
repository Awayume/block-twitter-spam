import {Enum} from '../utils/enum.js';

/**
 * @typedef {import('../utils/emum.js').Key} Key
 * @typedef {import('../utils/enum.js').Value} BadgeType
 */

/**
 * @type {Object<Key, BadgeType>} 認証バッジの種類を表す列挙型
 */
export const Badge = new Enum(
    'ORIGINAL',
    'BLUE',
    'BUSINESS',
    'GOVERNMENT',
);
