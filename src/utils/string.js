/**
 * テキストに占める日本語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 日本語の割合
 */
export const calcJapaneseRatio = (text) => { // eslint-disable-line no-unused-vars
  // 日本語の文字数を求める
  let japaneseCount = 0;
  for (const element of text) {
    if (/[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF65-\uFF9F]/.test(element)) {
      japaneseCount++;
    }
  }
  // 日本語の文字数をテキストの文字数で割る
  return japaneseCount / text.length;
};


/**
 * テキストに占めるアラビア語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} アラビア語の割合
 */
export const calcArabicRatio = (text) => {
  // アラビア語の文字数を求める
  let arabicCount = 0;
  for (const element of text) {
    if (/[\u0600-\u06FF]/.test(element)) {
      arabicCount++;
    }
  }
  // アラビア語の文字数をテキストの文字数で割る
  return arabicCount / text.length;
};


/**
 * テキストの絵文字の個数を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 絵文字の個数
 */
const calcEmojiCount = (text) => {
  // 絵文字の個数を求める
  let emojiCount = 0;
  for (const element of text) {
    if (/\p{Emoji}/u.test(element)) {
      emojiCount++;
    }
  }
  return emojiCount;
};


/**
 * テキストに占める絵文字の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 絵文字の割合
 */
export const calcEmojiRatio = (text) => {
  // 絵文字の個数を求める
  const emojiCount = calcEmojiCount(text);
  // 絵文字の個数をテキストの文字数で割る
  return emojiCount / text.length;
};
