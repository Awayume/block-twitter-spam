/**
 * ツイートのデータを保持するクラス。
 */
export class Tweet {
  /**
   * Tweetクラスを初期化する。
   */
  constructor() {
    /** @type {string} エレメントの識別に用いる内部的な値 */
    this._ariaLabelledby = undefined;
    /** @type {Object} ツイート作成者の情報 */
    this.author = {
      /** @type {string} ユーザーID */
      id: undefined,
      /** @type {string} ユーザーの名前 */
      name: undefined,
      /** @type {string} ユーザーのスクリーンネーム (ID) */
      screenName: undefined,
      /** @type {string?} ユーザーのプロフィール */
      description: undefined,
      /** @type {Object?} ユーザー認証の情報 */
      verifyStatus: {
        // TODO: 列挙型を作成
        /** @type {string} 認証の種類 */
        type: undefined,
        /**
         * 認証された日時を取得する。
         *
         * @return {Promise<Date>} 認証された日時
         */
        get verifiedAt() {
          // TODO
          throw new Error('Not implemented');
        },
      },
      /** @type {number} 総ツイート数 */
      tweetTotalCount: undefined,
      /** @type {number} フォロー数 */
      followsCount: undefined,
      /** @type {number} フォロワー数 */
      followersCount: undefined,
      /** @type {boolean} フォローしているかどうか */
      isFollowing: undefined,
      /** @type {boolean} フォローされているかどうか */
      isFollowed: undefined,
      /** @type {boolean} ブロックしているかどうか */
      isBlocking: undefined,
      /** @type {boolean} ブロックされているかどうか */
      isBlocked: undefined,
      /** @type {Date} アカウントの作成日時 */
      createdAt: undefined,
    };
    /** @type {string} ツイートID */
    this.id = undefined;
    /** @type {string} ツイートの言語 */
    this.language = undefined;
    /** @type {string?} ツイートの内容 */
    this.content = undefined;
    /** @type {number} リプライ数 */
    this.replyCount = undefined;
    /** @type {number} いいね数 */
    this.likeCount = undefined;
    /** @type {number} リツイート数 */
    this.retweetCount = undefined;
    /** @type {number} 引用リツイート数 */
    this.quoteCount = undefined;
    /** @type {number} ブックマーク数 */
    this.bookmarkCount = undefined;
    /** @type {boolean} いいね済みかどうか */
    this.isLiked = undefined;
    /** @type {boolean} リツイート済みかどうか */
    this.isRetweeted = undefined;
    /** @type {boolean} ブックマーク済みかどうか */
    this.isBookmarked = undefined;
    /** @type {Date} ツイートされた日時 */
    this.createdAt = undefined;
  }

  /**
   * ツイートを解析しTweetクラスを生成する。
   *
   * @param {Element} article - articleエレメント
   * @return {Tweet} 解析されたツイートのデータ
   * @throws {TypeError} 無効な引数もしくはツイートのデータが含まれていないエレメントを引数として受け取った
   */
  static from(article) {
    if (!article) {
      throw new TypeError('無効な引数: "article"');
    }

    const groupElement = article.querySelector('div[role=\'group\'][id]');
    // __reactProps$で始まるプロパティを探す
    const tweetProperties = groupElement[Object.getOwnPropertyNames(groupElement || {})
        .find((n) => n.startsWith('__reactProps$'))];
    const quotedStatus = tweetProperties?.children[1]?.props?.retweetWithCommentLink.state.quotedStatus;

    // 正しいエレメントか確認
    if (!tweetProperties || !quotedStatus) {
      throw new TypeError('ツイートのデータが含まれていないエレメント');
    }

    const tweet = new Tweet();
    const user = quotedStatus.user;

    tweet._ariaLabelledby = article[Object.getOwnPropertyNames(article)
        .find((n) => n.startsWith('__reactProps$'))]['aria-labelledby'];

    tweet.author.id = user.id_str;
    tweet.author.name = user.name;
    tweet.author.screenName = user.screen_name;
    tweet.author.description = user.description;

    if (user.verified || user.verified_type || user.is_blue_verified) {
      tweet.author.verifyStatus.type = user.verified_type || (user.is_blue_verified ? 'Blue' : null);
    } else {
      tweet.author.verifyStatus = null;
    }

    tweet.author.tweetTotalCount = user.statuses_count;
    tweet.author.followsCount = user.friends_count;
    tweet.author.followersCount = user.followers_count;
    tweet.author.isFollowing = user.following || false;
    tweet.author.isFollowed = user.followed_by || false;
    tweet.author.isBlocking = user.blocking || false;
    tweet.author.isBlocked = user.blocked_by || false;
    tweet.author.createdAt = new Date(user.created_at);

    tweet.id = quotedStatus.id_str;
    tweet.language = quotedStatus.lang;
    tweet.content = quotedStatus.full_text;
    tweet.replyCount = quotedStatus.reply_count;
    tweet.likeCount = quotedStatus.favorite_count;
    tweet.retweetCount = quotedStatus.retweet_count;
    tweet.quoteCount = quotedStatus.quote_count;
    tweet.bookmarkCount = quotedStatus.bookmark_count;
    tweet.isLiked = quotedStatus.favorited;
    tweet.isRetweeted = quotedStatus.retweeted;
    tweet.isBookmarked = quotedStatus.bookmarked;
    tweet.createdAt = new Date(quotedStatus.created_at);

    return tweet;
  }

  /**
   * リプライを取得する。
   *
   * @async
   * @param {number?} [limit] - 取得するツイートの最大数
   * @return {Promise<Array<Tweet>>} 取得したツイートの配列
   */
  async getReplies(limit) {
    // TODO
    throw new Error('Not implemented');
  }

  /**
   * 引用ツイートを取得する。
   *
   * @async
   * @param {number?} [limit] - 取得するツイートの最大数
   * @return {Promise<Array<Tweet>>} 取得したツイートの配列
   */
  async getQuotes(limit) {
    // TODO
    throw new Error('Not implemented');
  }
}
