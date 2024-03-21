/**
 * スパムによくある文言が含まれているか確認する。
 *
 * @param {string} text - 判定するテキスト
 * @return {boolean} スパムによくある文言が含まれていた場合はtrue, そうでない場合はfalse
 */
export const checkSpamWords = (text) => {
  /**
   * スパムによくある文言を入れる配列。
   * @type {Array<string>}
   */
  const spamWords = ['お前のプロフ抜けるわ', 'よかったらプロフ見て'];
  // スパムによくある文言が含まれているか確認
  let isSpam = false;
  for (const spamWord of spamWords) {
    if (text.includes(spamWord)) {
      isSpam = true;
    }
  }
  return isSpam;
};
