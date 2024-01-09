var characterRanges = {
    'ja': [
        [0x3040, 0x309F], // ひらがな
        [0x30A0, 0x30FF], // カタカナ
        [0xFF65, 0xFF9F], // 半角カタカナ
        [0x4E00, 0x9FFF] // 漢字
    ],
    'en': [
        [0x0041, 0x005A], // 英大文字
        [0x0061, 0x007A] // 英小文字
    ],
    'ar': [0x0600, 0x06FF], // アラビア文字
    'zh': [0x4E00, 0x9FFF], // 漢字（中国語）
    'ko': [0xAC00, 0xD7AF], // ハングル（韓国語）
    'ru': [0x0400, 0x04FF], // キリル文字（ロシア語）
    'he': [0x0590, 0x05FF], // ヘブライ文字
    'hi': [0x0900, 0x097F], // ヒンディー語
    'th': [0x0E00, 0x0E7F], // タイ文字
    'fa': [0x0600, 0x06FF], // ペルシャ語
    'de': [
        [0x00C0, 0x00FF], // Umlauts, ß, etc.
        [0x0152, 0x0153], // Œ, œ
        [0x20A0, 0x20CF] // Currency symbols, etc.
    ],
    'es': [
        [0x00C0, 0x00FF], // Accented characters
        [0x20A0, 0x20CF] // Currency symbols, etc.
    ],
    'emoji': [0x1F300, 0x1F5FF] // 絵文字
};

function detect_lang(text) {
    var langStats = {};
    var totalCount = 0;

    // 言語ごとの出現数をカウント
    for (var i = 0; i < text.length; i++) {
        var charCode = text.charCodeAt(i);
        var found = false;

        for (var lang in characterRanges) {
            if (!langStats[lang]) {
                langStats[lang] = 0;
            }

            var ranges = characterRanges[lang];

            for (var j = 0; j < ranges.length; j++) {
                var range = ranges[j];
                if (Array.isArray(range)) {
                    if (charCode >= range[0] && charCode <= range[1]) {
                        langStats[lang]++;
                        totalCount++;
                        found = true;
                        break;
                    }
                } else {
                    if (charCode >= ranges[0] && charCode <= ranges[1]) {
                        langStats[lang]++;
                        totalCount++;
                        found = true;
                        break;
                    }
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            langStats['unknown'] = (langStats['unknown'] || 0) + 1;
            totalCount++;
        }
    }

    // 言語判定
    var langPercentages = [];
    for (var lang in langStats) {
        var percentage = langStats[lang] / totalCount;
        langPercentages.push({ lang: lang, percentage: percentage });
    }

    // もしlangPercentagesが空の場合、'unknown' を追加
    if (langPercentages.length === 0) {
        langPercentages.push({ lang: 'unknown', percentage: 1 });
    }

    // 確率の高い順にソート
    langPercentages.sort(function (a, b) {
        return b.percentage - a.percentage;
    });

    // 2番目の可能性も返す
    var secondLang = langPercentages[1] ? langPercentages[1].lang : null;

    return { primary: langPercentages[0].lang, secondary: secondLang };
}