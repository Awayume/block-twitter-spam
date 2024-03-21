import {detectLang} from '../utils/language.js';
import {haveCommonValues} from '../utils/object.js';
import {calcArabicRatio, calcEmojiRatio} from '../utils/string.js';
import {checkSpamWords} from './word.js';


/**
 * @typedef {import('../twitter/tweet.js').Tweet} Tweet
 *
 * @typedef {Object} SpamInfo - スパムの情報
 * @property {number} score - スパムスコア
 * @property {string} reason - 判定の理由
 */


/**
 * ツイートがスパムかどうか判定する。
 *
 * @param {Tweet} tweet - ツイートのデータ
 * @return {SpamInfo} スパム判定の結果
 */
export const calcSpamScore = (tweet) => { // eslint-disable-line sonarjs/cognitive-complexity
  let spamScore = 0;
  /** @type {string} htmlとしてスパムの理由を入れる変数 */
  let spamReason = '';

  // ツイート本文のアラビア語の割合を求める
  const arabicRatio = calcArabicRatio(tweet.content);
  // ツイート本文の絵文字の割合を求める
  const emojiRatio = calcEmojiRatio(tweet.content);
  // プロフィール文のアラビア語の割合を求める
  // eslint-disable-next-line no-unused-vars
  const arabicRatioProfile = calcArabicRatio(tweet.author.description);
  // プロフィール文の文字数を求める
  // eslint-disable-next-line no-unused-vars
  const profileLength = tweet.author.description.length;
  // ユーザー名のアラビア語の割合を求める
  // eslint-disable-next-line no-unused-vars
  const arabicRatioName = calcArabicRatio(tweet.author.name);

  // スパムによくある文言が含まれている場合
  if (checkSpamWords(tweet.content)) {
    console.log('スパムによくある文言が含まれています');
    spamReason+='<p>スパムによくある文言が含まれています</p>';
    spamScore += 50;
  }

  // 絵文字の割合が0.5以上の場合
  if (emojiRatio >= 0.5) {
    console.log('絵文字の割合が0.5以上');
    spamReason+='<p>絵文字の割合が0.5以上</p>';
    spamScore += 10;
  }

  // プロフィールとツイート本文の言語が異なるかを確認。異なる場合はスコアを10加算する
  const tweetLang = detectLang(tweet.content);
  const profileLang = detectLang(tweet.author.description);
  console.log('tweetLang', tweetLang);
  console.log('profileLang', profileLang);

  // プロフィールとツイート本文の言語が異なる場合primaryとsecondaryの順序は問わず一致するか確認。
  if (!haveCommonValues(tweetLang, profileLang)) {
    console.log('ツイート言語とプロフィール言語が異なるためスコアを20加算します');
    spamReason+='<p>ツイート言語とプロフィール言語が異なる</p>';
    spamScore += 20;
  }

  // アラビア語が含まれている場合
  if (arabicRatio > 0) {
    console.log('アラビア語が含まれているためスコアを20加算します');
    spamReason+='<p>アラビア語が含まれている</p>';
    spamScore += 20;
  }

  // blue verifiedの場合
  if (tweet.author.verifyStatus?.type === 'Blue') {
    console.log('blue verifiedのためスコアを20加算します');
    spamReason+='<p>blue verified</p>';
    spamScore += 20;
  }

  /** @type {number} そのユーザーによるツリー内のツイート数 */
  let tweetCount = 0;
  // ツリー内かつ親ツイートと異なるユーザーの場合
  if (window.location.href.includes('/status/') && tweets[0].author.id !== tweet.author.id) {
    // 親ツイートと言語が一致しない場合のみ
    // TODO: 処理の改善
    if (tweets[0].language != tweet.language) {
      console.log('元ツイとツイート言語が異なるためスコアを30加算します');
      spamReason+='<p>元ツイとツイート言語が異なる</p>';
      // スコアを30加算する
      spamScore += 30;
    }

    for (const tw of tweets) {
      if (tweet.id === tw.id && tweet.author.id === tw.author.id) tweetCount++;
    }

    if (tweetCount >= 2) {
      console.log('リプに同じ人が2個以上いるためスコアを30加算します');
      spamReason+='<p>リプに同じ人が2個以上いる</p>';
      spamScore += 30;
    }
  }

  return {'score': spamScore, 'reason': spamReason};
};
