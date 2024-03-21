import {calcSpamScore} from './checker/checker.js';
import {Tweet} from './twitter/tweet.js';

/**
 * ツイートデータを保存する配列。
 * @type {Array<Tweet>}
 */
const tweets = [];
let url = window.location.href;

/**
 * ツイートの解析を行う。
 */
const main = () => { // eslint-disable-line sonarjs/cognitive-complexity
  // TODO: sonarjs/cognitive-complexityの解消
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
