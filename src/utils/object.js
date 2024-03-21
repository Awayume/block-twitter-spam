/**
 * 2つの辞書が共通の値を持っているかどうかを確認する。
 *
 * @param {Object<any, any>} dict1 - 辞書1
 * @param {Object<any, any>} dict2 - 辞書2
 * @return {boolean} 2つの辞書が共通の値を持っている場合はtrue、そうでない場合はfalse
 */
export const haveCommonValues = (dict1, dict2) => {
  // 辞書から値の配列を取得
  const values1 = Object.values(dict1);
  const values2 = Object.values(dict2);

  /**
   * 共通値を格納するためのセット。
   * @type {Set<any>}
  */
  const commonValues = new Set();

  // 辞書1の値をセットに追加
  for (const value of values1) {
    if (value !== 'unknown') {
      commonValues.add(value);
    }
  }

  // 辞書2の値と比較して共通値があるかをチェック
  for (const value of values2) {
    if (value !== 'unknown' && commonValues.has(value)) {
      return true;
    }
  }

  return false;
};
