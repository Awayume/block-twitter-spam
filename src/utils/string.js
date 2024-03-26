import {characterRanges} from './language.js';

/**
 * テキストに占める日本語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 日本語の割合
 */
export const calcJapaneseRatio = (text) => { // eslint-disable-line no-unused-vars
  let japaneseCount = 0;
  for (const char of text) {
    if (characterRanges.ja.test(char)) japaneseCount++;
  }
  return japaneseCount / text.length;
};


/**
 * テキストに占めるアラビア語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} アラビア語の割合
 */
export const calcArabicRatio = (text) => {
  let arabicCount = 0;
  for (const char of text) {
    if (characterRanges.ar.test(char)) arabicCount++;
  }
  return arabicCount / text.length;
};


/**
 * テキストに占める絵文字の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 絵文字の割合
 */
export const calcEmojiRatio = (text) => {
  let emojiCount = 0;
  for (const char of text) {
    if (characterRanges.emoji.test(char)) emojiCount++;
  }
  return emojiCount / text.length;
};
