/**
 * @typedef {Object} CheckResult - スパムチェックの結果
 * @property {number} score - スパムスコア
 * @property {Array<string>} reasons - 判定の理由
 */

/**
 * 各チェッカーの基底クラス。
 */
export default class CheckerBase {
  /** @type {import('../twitter/tweet.js').Tweet} スパムチェックに使用するデータ */
  #data = undefined;
  /** @type {Object<string, any>} チェッカーのオプション */
  #options = undefined;

  /**
   * クラスを初期化する。
   *
   * @param {import('../twitter/tweet.js').Tweet} data - スパムチェックに使用するデータ
   * @param {Object<string, any>} [options] - チェッカーのオプション
   */
  constructor(data, options) {
    this.#data = data;
    this.#options = options;
  }

  /**
   * スパムチェックを行う。
   *
   * @async
   * @return {Promise<CheckResult>} スパムチェックの結果
   */
  async check() {
    throw new TypeError('TypeError: このメソッドはオーバーライドされる必要があります');
  }
}
