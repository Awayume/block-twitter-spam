/**
 * 各チェッカーの基底クラス。
 */
export default class CheckerBase {
  /**
   * クラスを初期化する。
   *
   * @template T
   * @template U
   * @param {T} data - スパムチェックに用いるデータ
   * @param {Object<string, U>} [options] - チェッカーのオプション
   */
  constructor(data, options) {
    /** @type {T} */
    this.data = data;
    /** @type {Object<string, U>} */
    this.options = options;
  }

  /**
   * スパムチェックを行う。
   *
   * @async
   * @return {Promise<{score: number, reasons: Array<string>}>} スパムチェックの結果
   */
  async check() {
    throw new TypeError('TypeError: このメソッドはオーバーライドされる必要があります');
  }
}
