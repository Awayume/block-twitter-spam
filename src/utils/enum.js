/**
 * @typedef {string} Key - 列挙型のキー
 * @typedef {string} Value - 列挙型の要素
 */

/**
 * 列挙型を表すクラス。
 */
export class Enum {
  /**
   * 列挙型を作成する。
   *
   * 使用例:
   * ```
   * const MyEnum = new Enum(
   *     'APPLE',
   *     'BANANA',
   * );
   * ```
   *
   * @param {Array<string>} values - 列挙型の要素
   * @throws {TypeError} 無効な引数
   */
  constructor(...values) {
    for (const value of values) {
      if (typeof value !== 'string') {
        throw new TypeError(`無効な引数: "${value}" は文字列ではありません`);
      } else if (!/^[A-Z]+$/.test(value)) {
        throw new TypeError('無効な引数: 各要素は大文字である必要があります');
      }

      this[value] = value;
    }
    /** @type {Array<string>} 要素の一覧 */
    this.values = values;
  }

  /**
   * 与えられた文字列に一致する要素を返す。
   *
   * @param {string} key - 列挙型のある要素の文字列表現
   * @return {Value} - 列挙型の要素
   * @throws {TypeError} 無効な引数もしくは存在しない要素
   */
  of(key) {
    if (!key) {
      throw new TypeError('無効な引数: "key"');
    }
    const value = this[key.toUpperCase()];
    if (!value) {
      throw new TypeError(`無効な引数: 要素 "${key}" は存在しません`);
    }
    return value;
  }
};
