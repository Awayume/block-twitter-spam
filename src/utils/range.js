/**
 * 範囲を表すクラス。
 */
export class Range {
  /**
   * インスタンスを作成する。
   *
   * 使用例:
   * ```
   * const range = new Range(1, 5) // 1, 2, 3, 4, 5
   * ```
   *
   * @param {number} start - 開始地点
   * @param {number} end - 終了地点
   * @throws {TypeError} 無効な引数が与えられた場合
   */
  constructor(start, end) {
    if (!start || typeof start !== 'number') {
      throw new TypeError('無効な引数: "start"');
    }
    if (!end || typeof end !== 'number') {
      throw new TypeError('無効な引数: "end"');
    }
    /** @type {number} 開始地点 */
    this.start = start;
    /** @type {number} 終了地点 */
    this.end = end;
  }

  /**
   * 値が範囲に含まれるか確認する。
   *
   * @param {number} value - 確認する値
   * @return {boolean} 含まれていた場合はtrue、そうでない場合はfalse
   */
  isContains(value) {
    return value >= this.start && value <= this.end;
  }
};
