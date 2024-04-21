/**
 * @typedef {import('../twitter/tweet.js').Tweet} Tweet
 *
 * @typedef {Object} CheckResult - スパムチェックの結果
 * @property {number} score - スパムスコア
 * @property {Array<string>} reasons - 判定の理由
 */

/**
 * 各チェッカーの基底クラス。
 */
export default class CheckerBase {
  /** @type {Object<string, any>} チェッカーのオプション */
  #options = undefined;

  /**
   * クラスを初期化する。
   *
   * @param {Object<string, any>} [options] - チェッカーのオプション
   */
  constructor(options) {
    this.#options = options;
  }

  /**
   * スパムチェックを行う。
   *
   * @async
   * @param {Tweet} tweet - スパムチェック対象のツイート
   * @return {Promise<CheckResult>} スパムチェックの結果
   */
  async check(tweet) {
    throw new TypeError('TypeError: このメソッドはオーバーライドされる必要があります');
  }
}
