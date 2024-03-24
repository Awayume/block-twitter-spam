import {Range} from './range.js';


/**
 * @typedef {Object} LangInfo - ツイートの主言語を示すオブジェクト
 * @property {string} primary - 最も可能性が高い言語
 * @property {string?} secondary - 2番目に可能性が高い言語
 */

/**
 * 言語別にUnicodeコードポイントの範囲を分類する連想配列。
 * @type {Object<string, Array<Range> | Range>}
 */
const characterRanges = {
  ja: [
    new Range(0x30_40, 0x30_FF), // ひらがな, カタカナ
    new Range(0xFF_65, 0xFF_9F), // 半角カタカナ
    new Range(0x4E_00, 0x9F_FF), // 漢字
  ],
  en: [
    new Range(0x00_41, 0x00_5A), // 英大文字
    new Range(0x00_61, 0x00_7A), // 英小文字
  ],
  ar: new Range(0x06_00, 0x06_FF), // アラビア文字
  zh: new Range(0x4E_00, 0x9F_FF), // 漢字（中国語）
  ko: new Range(0xAC_00, 0xD7_AF), // ハングル（韓国語）
  ru: new Range(0x04_00, 0x04_FF), // キリル文字（ロシア語）
  he: new Range(0x05_90, 0x05_FF), // ヘブライ文字
  hi: new Range(0x09_00, 0x09_7F), // ヒンディー語
  th: new Range(0x0E_00, 0x0E_7F), // タイ文字
  fa: new Range(0x06_00, 0x06_FF), // ペルシャ語
  de: [
    new Range(0x00_C0, 0x00_FF), // Umlauts, ß, etc.
    new Range(0x01_52, 0x01_53), // Œ, œ
    new Range(0x20_A0, 0x20_CF), // Currency symbols, etc.
  ],
  es: [
    new Range(0x00_C0, 0x00_FF), // Accented characters
    new Range(0x20_A0, 0x20_CF), // Currency symbols, etc.
  ],
  // TODO: 修正
  emoji: new Range(0x1_F3_00, 0x1_F5_FF), // 絵文字
};

/**
 * ツイートの主言語を推測する。
 *
 * @param {string} text - ツイートのテキスト
 * @return {LangInfo} 推測したツイートの主言語
 */
export const detectLang = (text) => { // eslint-disable-line sonarjs/cognitive-complexity
  /** @type {Object<string, number>} */
  const langStats = {};
  for (const lang in characterRanges) langStats[lang] = 0;
  langStats['unknown'] = 0;

  // 言語ごとの出現数をカウント
  for (const char of text) {
    const charCode = char.codePointAt();
    let isFound = false;

    for (const lang in characterRanges) {
      const range = characterRanges[lang];

      if (range instanceof Range) {
        if (range.isContains(charCode)) {
          langStats[lang]++;
          isFound = true;
          break;
        }
      } else {
        for (const range_ of range) {
          if (range_.isContains(charCode)) {
            langStats[lang]++;
            isFound = true;
            break;
          }
        }
      }
    }

    if (!isFound) langStats['unknown']++;
  }

  // 言語ごとに割合を求める
  /** @type {Array<{lang: string, ratios}>} */
  const langRatios = [];
  for (const lang in langStats) {
    langRatios.push({lang: lang, percentage: langStats[lang] / text.length});
  }

  // 割合の高い順にソート
  langRatios.sort((a, b) => {
    return b.percentage - a.percentage;
  });

  return {primary: langRatios[0].lang, secondary: langRatios[1] ? langRatios[1].lang : null};
};
