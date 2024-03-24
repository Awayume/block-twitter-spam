/**
 * スパムによくある文言が含まれているか確認する。
 *
 * @param {string} text - 判定するテキスト
 * @return {boolean} スパムによくある文言が含まれていた場合はtrue, そうでない場合はfalse
 */
export const checkSpamWords = (text) => {
  /** @type {Array<RegExp>} スパムによくある文言の正規表現の配列 */
  const spamWords = [
    /お前の(プロフ|固ツイ|固定(ツイート|ポスト)?).*(抜|ヌ)ける(わ)?/,
    /(よ|良)かったら(プロフ|ぷろふ)(見|み)て/,
  ];
  // eslint-disable-next-line sonarjs/no-unused-collection
  const results = [];
  let isSpam = false;
  for (const spamWord of spamWords) {
    const result = text.match(spamWord);
    if (result) {
      results.push(result);
      isSpam = true;
      break;
    }
  }
  // TODO: resultsを使ってログ処理
  return isSpam;
};
