/**
 * @typedef {Object} LangInfo - ツイートの主言語を示すオブジェクト
 * @property {string} primary - 最も可能性が高い言語
 * @property {string?} secondary - 2番目に可能性が高い言語
 */

/**
 * 言語別にUnicodeコードポイントの範囲を分類する連想配列。
 * @type {Object<string, RegExp>}
 */
export const characterRanges = {
  // NOTE: 間違いが複数あり
  // TODO: 正しいものに修正する
  ja: /[\u3040-\u30FF]|[\uFF65-\uFF9F]|[\u4E00-\u9FFF]/g, // ひらがな,カタカナ|半角カタカナ|漢字
  // eslint-disable-next-line unicorn/better-regex
  en: /[\u0041-\u005A]|[\u0061-\u007A]/g, // 英大文字|英小文字
  ar: /[\u0600-\u06FF]/g, // アラビア文字
  zh: /[\u4E00-\u9FFF]/g, // 漢字（中国語）
  ko: /[\uAC00-\uD7AF]/g, // ハングル（韓国語）
  ru: /[\u0400-\u04FF]/g, // キリル文字（ロシア語）
  he: /[\u0590-\u05FF]/g, // ヘブライ文字
  hi: /[\u0900-\u097F]/g, // ヒンディー語
  th: /[\u0E00-\u0E7F]/g, // タイ文字
  fa: /[\u0600-\u06FF]/g, // ペルシャ語
  de: /[\u00C0-\u00FF]|\u0152|\u0153|[\u20A0-\u20CF]/g, // Umlauts,ß, etc.|Œ,œ|Currency symbols, etc.
  es: /[\u00C0-\u00FF]|[\u20A0-\u20CF]/g, // Accented characters|Currency symbols, etc.
  emoji: /[\uD83C\uDC00-\uD83E\uDDFF]/gu, // 絵文字
};

/**
 * ツイートの主言語を推測する。
 *
 * @param {string} text - ツイートのテキスト
 * @return {LangInfo} 推測したツイートの主言語
 */
export const detectLang = (text) => {
  /** @type {Array<{lang: string, ratio: number}>} */
  const langStats = [];
  let textCount = text.length;

  // 言語ごとの出現数をカウントし割合を求める
  for (const lang in characterRanges) {
    const result = text.match(characterRanges[lang]);
    if (result) {
      langStats.push({lang: lang, ratio: result.length / text.length});
      textCount = textCount - result.length;
      if (!textCount) break;
    }
  }

  // どの言語にも分類されていない文字をunknownとして扱う
  if (textCount) langStats['unknown'] = textCount;

  // 割合の高い順にソート
  langStats.sort((a, b) => {
    return b.ratio - a.ratio;
  });

  return {
    primary: langStats[0]?.ratio ? langStats[0].lang : null,
    secondary: langStats[1]?.ratio ? langStats[1].lang : null,
  };
};
