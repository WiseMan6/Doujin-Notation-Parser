import { describe, expect, test } from 'bun:test';
import { bare, square } from "./utils";
import { parseFilename } from "../index";

const $ = parseFilename;

describe("FAKKU", () => {
    test("Series", () => {
        expect($(`[Esuke] The Beast's Gratitude(?)`)).toEqual({
            Title: "The Beast's Gratitude(?)",
            Artists: ["Esuke"]
        });
        expect($(`[Esuke] The Beast's Gratitude(?) 2`)).toEqual({
            Title: "The Beast's Gratitude(?) 2",
            Artists: ["Esuke"]
        });

        expect($(`[Kise Itsuki] Cross-Stitch (Color)`)).toEqual({
            Title: "Cross-Stitch (Color)",
            Artists: ["Kise Itsuki"]
        });

        expect($("[Athome Shuka (Takunomi)] Assisted Mating 12")).toEqual({
            Title: "Assisted Mating 12",
            Artists: ["Takunomi"],
            Circles: ["Athome Shuka"]
        });

        expect($("(C91) [wadamemo (WADA Rco)] Fate GO MEMO (Fate/Grand Order)")).toEqual({
            Title: "Fate GO MEMO",
            Artists: ["WADA Rco"],
            Circles: ["wadamemo"],
            Head: ["C91"],
            Tail: [bare`Fate/Grand Order`]
        });

        expect($("[Spiritus Tarou] (Pretend) Sleeping Beauty (Comic Bavel 2016-04)")).toEqual({
            Title: "(Pretend) Sleeping Beauty",
            Artists: ["Spiritus Tarou"],
            Tail: [bare`Comic Bavel 2016-04`]
        });
        expect($("[Polinky] One Summer's (Bad) Dream (Comic Shitsurakuten 2016-09)")).toEqual({
            Title: "One Summer's (Bad) Dream",
            Artists: ["Polinky"],
            Tail: [bare`Comic Shitsurakuten 2016-09`]
        });

        expect($("[Akinosora] I Was Summoned to Another World, So I'm Going to Take Advantage of My Honed Body to Get Lucky ~Part 4~ (Comic X-Eros #115)")).toEqual({
            Title: "I Was Summoned to Another World, So I'm Going to Take Advantage of My Honed Body to Get Lucky ~Part 4~",
            Artists: ["Akinosora"],
            Tail: [bare`Comic X-Eros #115`]
        });

        // Names like `A& B` would still be treated as two distinct entries
        expect($("[Cuck Manga J&W] THIS ARTIST HAS SUPERLATIVELY AWFUL NAMING SENSE ALL AROUND (x3200) [FAKKU]")).toEqual({
            Title: "THIS ARTIST HAS SUPERLATIVELY AWFUL NAMING SENSE ALL AROUND",
            Artists: ["Cuck Manga J&W"],
            Tail: [
                bare `x3200`,
                square `FAKKU`
            ]
        });
    });

    test("Magazines", () => {
        expect($("[YUG] School Regulation Violation #61 (Comic Kairakuten 2017-10)")).toEqual({
            Artists: ["YUG"],
            Title: "School Regulation Violation #61",
            Tail: [bare`Comic Kairakuten 2017-10`]
        });
        expect($("[Akagi Asahito] BEAST Cover Artist Page 2018-07 (Comic Kairakuten BEAST 2018-07)")).toEqual({
            Artists: ["Akagi Asahito"],
            Title: "BEAST Cover Artist Page 2018-07",
            Tail: [bare`Comic Kairakuten BEAST 2018-07`]
        });
        expect($("[Kakei Kei & Kyockcho] Comic Bavel 2024-12 Double Cover (Comic Bavel 2024-12)")).toEqual({
            Artists: ["Kakei Kei", "Kyockcho"],
            Title: "Comic Bavel 2024-12 Double Cover",
            Tail: [bare`Comic Bavel 2024-12`]
        });
        // expect($("[Okuyama(to)] X-Eros Girls Collection #105_ Okuyama(to) (Comic X-Eros #105)")).toEqual({
        //     Artists: ["Okuyama(to)"],
        //     Title: "X-Eros Girls Collection #105_ Okuyama(to)",
        //     Tail: [bare`Comic X-Eros #105`]
        // });
    });

    test("Malformed", () => {
        expect($("[Yamamoto Tomomitsu] We're No-Nonsense Goody Two Shoes (x3200) FAKKU]")).toEqual({
            Title: "We're No-Nonsense Goody Two Shoes (x3200) FAKKU]",
            Artists: ["Yamamoto Tomomitsu"]
        });
        expect($("[Re-Fire (Tatsunami Youtoku)] Twin Milf Additional Episode +1(x3200) [FAKKU & Irodori]")).toEqual({
            Title: "Twin Milf Additional Episode +1(x3200)",
            Artists: ["Tatsunami Youtoku"],
            Circles: ["Re-Fire"],
            Tail: [square`FAKKU & Irodori`]
        });
    });
});

describe("Sad Panda & Other", () => {
    test("English", () => {
        expect($("[Horizontal World (Matanonki)] Love It (One) More (Blue Archive) [English] [Team Rabu2]")).toEqual({
            Title: "Love It (One) More",
            Artists: ["Matanonki"],
            Circles: ["Horizontal World"],
            Tail: [
                bare `Blue Archive`,
                square `English`,
                square `Team Rabu2`
            ]
        });
        expect($("(C102) [Junjou Hedgehog (Kaguyuzu)] Irou Kitan -Shuten Douji Soushuuhen- (Fate_Grand Order) [Chinese] [黑锅汉化组]")).toEqual({
            Title: "Irou Kitan -Shuten Douji Soushuuhen-",
            Artists: ["Kaguyuzu"],
            Circles: ["Junjou Hedgehog"],
            Head: ["C102"],
            Tail: [
                bare `Fate_Grand Order`,
                square `Chinese`,
                square `黑锅汉化组`
            ]
        });
        expect($("(CCOsaka107) [Haraheridou (Herio)] Yodooshi Lamretta (Granblue Fantasy) [English] =White Symphony=")).toEqual({
            Title: "Yodooshi Lamretta",
            Artists: ["Herio"],
            Circles: ["Haraheridou"],
            Head: ["CCOsaka107"],
            Tail: [
                bare `Granblue Fantasy`,
                square `English`
            ]
        });
    });

    test("Japanese & Chinese", () => {
        expect($("[毛玉牛乳 (玉之けだま)] 血姫夜交-真祖の姫は発情しているっ！-  [中国翻訳] [無修正] [DL版]")).toEqual({
            Title: "血姫夜交-真祖の姫は発情しているっ！-",
            Artists: ["玉之けだま"],
            Circles: ["毛玉牛乳"],
            Tail: [
                square `中国翻訳`,
                square `無修正`,
                square `DL版`
            ]
        });
        expect($("(C103) [餃子ベビー (笑笑餃子)] 全身マッサージしよう!キサキ会長!2 (ブルーアーカイブ) [DL版]")).toEqual({
            Title: "全身マッサージしよう!キサキ会長!2",
            Artists: ["笑笑餃子"],
            Circles: ["餃子ベビー"],
            Head: ["C103"],
            Tail: [
                bare `ブルーアーカイブ`,
                square `DL版`
            ]
        });
    });

    test("Mixed", () => {
        // Special case
        expect($("[AI Decensored][Buryuburyu Tokoroten Milk (Yapo)] Cagliostro to Himitsu no Renkinjutsu | 与卡莉奥丝特罗的秘密炼金术 (Granblue Fantasy) [Chinese] [田中罗密欧个人汉化] [Decensored] [Digital]")).toEqual({
            Title: "Cagliostro to Himitsu no Renkinjutsu | 与卡莉奥丝特罗的秘密炼金术",
            Artists: ["Yapo"],
            Circles: ["Buryuburyu Tokoroten Milk"],
            Tail: [
                bare `Granblue Fantasy`,
                square `Chinese`,
                square `田中罗密欧个人汉化`,
                square `Decensored`,
                square `Digital`,
            ]
        });
    });
});