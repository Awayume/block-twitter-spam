/**
 * @typedef {Object} LangInfo - ツイートの主言語を示すオブジェクト
 * @property {string} primary - 最も可能性が高い言語
 * @property {string?} secondary - 2番目に可能性が高い言語
 */

/**
 * 言語別にUnicodeコードポイントの範囲を分類する連想配列。
 * @type {Object<string, RegExp>}
 */
const characterRanges = {
  // NOTE: 間違いが複数あり
  // TODO: 正しいものに修正する
  ja: /[\u3040-\u30FF]|[\uFF65-\uFF9F]|[\u4E00-\u9FFF]/, // ひらがな,カタカナ|半角カタカナ|漢字
  // eslint-disable-next-line unicorn/better-regex
  en: /[\u0041-\u005A]|[\u0061-\u007A]/, // 英大文字|英小文字
  ar: /[\u0600-\u06FF]/, // アラビア文字
  zh: /[\u4E00-\u9FFF]/, // 漢字（中国語）
  ko: /[\uAC00-\uD7AF]/, // ハングル（韓国語）
  ru: /[\u0400-\u04FF]/, // キリル文字（ロシア語）
  he: /[\u0590-\u05FF]/, // ヘブライ文字
  hi: /[\u0900-\u097F]/, // ヒンディー語
  th: /[\u0E00-\u0E7F]/, // タイ文字
  fa: /[\u0600-\u06FF]/, // ペルシャ語
  de: /[\u00C0-\u00FF]|\u0152|\u0153|[\u20A0-\u20CF]/, // Umlauts,ß, etc.|Œ,œ|Currency symbols, etc.
  es: /[\u00C0-\u00FF]|[\u20A0-\u20CF]/, // Accented characters|Currency symbols, etc.
  emoji: /[\uD83C\uDC00-\uD83E\uDDFF]/u, // 絵文字
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
    let isFound = false;

    for (const lang in characterRanges) {
      if (characterRanges[lang].test(char)) {
        langStats[lang]++;
        isFound = true;
        break;
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
