const GQL_BASE_URL = 'https://twitter.com/i/api/graphql';
const V1_BASE_URL = 'https://api.twitter.com/1.1';
// eslint-disable-next-line no-unused-vars
const V2_BASE_URL = 'https://twitter.com/i/api/2';


/**
 * APIリクエストに必要なヘッダーを生成する。
 *
 * @return {Header} ヘッダー
 */
const getHeaders = () => {
  const headers = new Headers();
  // eslint-disable-next-line max-len
  headers.set('authorization', 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA');
  headers.set('content-type', 'application/json');
  return headers;
};


/**
 * ゲストトークンを取得する。
 *
 * @async
 * @return {Promise<string>} ゲストトークン
 */
const getGuestToken = async () => {
  const response = await fetch(`${V1_BASE_URL}/guest/activate.json`, {method: 'POST', headers: getHeaders()});
  // eslint-disable-next-line unicorn/no-await-expression-member
  return (await response.json()).guest_token;
};


export const getUserVerifiedDate = async (screenName) => {
  if (!screenName) {
    throw new TypeError('無効な引数: "screen_name"');
  }

  const headers = getHeaders();
  headers.set('x-guest-token', await getGuestToken());
  headers.set('x-twitter-active-user', 'yes');

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const params = new URLSearchParams();
  params.append('variables', JSON.stringify({screen_name: screenName}));
  params.append('features', JSON.stringify({
    hidden_profile_likes_enabled: false,
    hidden_profile_subscriptions_enabled: false,
    responsive_web_graphql_exclude_directive_enabled: true,
    verified_phone_label_enabled: false,
    subscriptions_verification_info_is_identity_verified_enabled: false,
    subscriptions_verification_info_verified_since_enabled: true,
    highlights_tweets_tab_ui_enabled: false,
    responsive_web_twitter_article_notes_tab_enabled: false,
    creator_subscriptions_tweet_preview_api_enabled: false,
    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
    responsive_web_graphql_timeline_navigation_enabled: false,
  }));

  const response = await fetch(
      `${GQL_BASE_URL}/k5XapwcSikNsEsILW5FvgA/UserByScreenName?${params.toString()}`,
      {headers: headers},
  );
  const data = await response.json();
  return new Date(Number(data.data.user.result.verification_info.reason.verified_since_msec));
};
