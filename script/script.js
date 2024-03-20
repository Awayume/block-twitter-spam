import {detectLang} from './detect_lang.js';
import {Tweet} from './twitter/tweet.js';


/**
 * 2つの辞書が共通の値を持っているかどうかを確認する。
 *
 * @param {Object<any, any>} dict1 - 辞書1
 * @param {Object<any, any>} dict2 - 辞書2
 * @return {boolean} 2つの辞書が共通の値を持っている場合はtrue、そうでない場合はfalse
 */
const haveCommonValues = (dict1, dict2) => {
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

/**
 * テキストに占める日本語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 日本語の割合
 */
const calcJapaneseRatio = (text) => { // eslint-disable-line no-unused-vars
  // 日本語の文字数を求める
  let japaneseCount = 0;
  for (const element of text) {
    if (/[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF65-\uFF9F]/.test(element)) {
      japaneseCount++;
    }
  }
  // 日本語の文字数をテキストの文字数で割る
  return japaneseCount / text.length;
};

/**
 * テキストに占めるアラビア語の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} アラビア語の割合
 */
const calcArabicRatio = (text) => {
  // アラビア語の文字数を求める
  let arabicCount = 0;
  for (const element of text) {
    if (/[\u0600-\u06FF]/.test(element)) {
      arabicCount++;
    }
  }
  // アラビア語の文字数をテキストの文字数で割る
  return arabicCount / text.length;
};

/**
 * テキストの絵文字の個数を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 絵文字の個数
 */
const calcEmojiCount = (text) => {
  // 絵文字の個数を求める
  let emojiCount = 0;
  for (const element of text) {
    if (/\p{Emoji}/u.test(element)) {
      emojiCount++;
    }
  }
  return emojiCount;
};

/**
 * テキストに占める絵文字の割合を求める。
 *
 * @param {string} text - 判定するテキスト
 * @return {number} 絵文字の割合
 */
const calcEmojiRatio = (text) => {
  // 絵文字の個数を求める
  const emojiCount = calcEmojiCount(text);
  // 絵文字の個数をテキストの文字数で割る
  return emojiCount / text.length;
};

/**
 * スパムによくある文言が含まれているか確認する。
 *
 * @param {string} text - 判定するテキスト
 * @return {boolean} スパムによくある文言が含まれていた場合はtrue, そうでない場合はfalse
 */
const checkSpamWord = (text) => {
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

/**
 * ツイートがスパムかどうか判定する。
 *
 * @param {Tweet} tweet - ツイートのデータ
 * @return {SpamInfo} スパム判定の結果
 */
const calcSpamScore = (tweet) => { // eslint-disable-line sonarjs/cognitive-complexity
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
  if (checkSpamWord(tweet.content)) {
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

  /** @type {Number} そのユーザーによるツリー内のツイート数 */
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
      if (tweet.id === tw.id && tweet.author.id === tw.author.id) {
        tweetCount++;
      }
    }
    if (tweetCount >= 2) {
      console.log('リプに同じ人が2個以上いるためスコアを30加算します');
      spamReason+='<p>リプに同じ人が2個以上いる</p>';
      spamScore += 30;
    }
  }

  return {'score': spamScore, 'reason': spamReason};
};

/**
 * ツイートデータを保存する配列。
 * @type {Array<Tweet>}
 */
const tweets = [];
let url = window.location.href;

/**
 * ツイートの解析を行う。
 */
const main = () => {
  // urlが変わった場合
  if (url != window.location.href) {
    // tweetsを初期化
    tweets.length = 0;
    // urlを更新
    url = window.location.href;
  }
  const elements = document.querySelectorAll('article');
  // 要素ごとにループ
  for (const article of elements) {
    try {
      const tweet = Tweet.from(article);
      let isExists = false;
      for (const tw of tweets) {
        if (tweet.id === tw.id) {
          isExists = true;
        }
      }
      if (!isExists) {
        tweets.push(tweet);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ツイートを処理
  for (const tweet of tweets) {
    // tweetが処理済みでない場合
    // TODO: 二重処理の対策
    // eslint-disable-next-line sonarjs/no-gratuitous-expressions
    if (!tweet.processed) {
      // スパム確認
      const spamResult = calcSpamScore(tweet);
      const score = spamResult['score'];
      const reason = spamResult['reason'];
      console.log('tweet', tweet);
      console.log('score', score);

      // aria-labelledbyでqueryselectorして背景色を110000にする
      const tweetElement = document.querySelector(`article[aria-labelledby='${tweet._ariaLabelledby}']`);

      // scoreが50以上の場合
      if (score >= 50) {
        // 通報
        console.log('通報');
        // TODO
        tweetElement.style.backgroundColor = '#ff0000';
      }
      // 理由を表示
      const reasonElement = document.createElement('div');
      reasonElement.innerHTML = reason;
      // 要素の外側（下）に追加
      tweetElement.after(reasonElement);
      // tweetDataを処理済みにする
      // TODO
      tweet.processed = true;
    }
  }
};

(() => {
  // data-testid="primaryColumn"に変更があった場合にsaveProps()を実行。console.logでtweetDatasを確認
  const observer = new MutationObserver(main);
  observer.observe(document.querySelector('body'), {
    childList: true,
    subtree: true,
  });
})();
