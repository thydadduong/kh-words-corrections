const khConsonants = require("./kh_char/kh_consonants.json");
const khDependentVowels = require("./kh_char/kh_dependent_vowels.json");
const khIndependentVowels = require("./kh_char/kh_independent_vowels.json");
const separators = ["\u200B", "\u200C"];
const khPunctuations = require("./kh_char/kh_punctuations.json");
const globalPunctuations = require("./kh_char/global_punctuations.json");
const punctuations = khPunctuations.concat(globalPunctuations);

const all_words = require("./kh_char_tree/master_char_tree.json");

const KhmerWordSegment = {
    data: {
        khConsonants,
        khDependentVowels,
        khIndependentVowels,
        separators,
        khPunctuations,
        globalPunctuations,
        punctuations,
        all_words
    },
    getObjectChild(object2filter, char) {
        return object2filter[char];
    },
    /**
     * To generate paragraph to be pieces by:\
     * 1. split paragraph by spaces (purpose to add space to the same place after join array of word).\
     * 2. split paragraph by zwsp (to remember where to place zwsp already added in paragraph)
     * @param {*} paragraph
     */
    generateParagraphChunk(paragraph) {
        let paragraphChunk;
        let firstSplit = paragraph.split(" "); //devise paragraph using spaces to be chunks

        paragraphChunk = firstSplit.map(
            chunk => chunk.split(new RegExp(separators.join("|"), "g")) // devise each chunk of paragraph to be sub-chunks
        );
        return paragraphChunk;
    },

    scanWords(paragraph) {
        let paragraphChunks = this.generateParagraphChunk(paragraph); // to get generated paragraph

        const {
            khConsonants,
            khDependentVowels,
            khIndependentVowels,
            // separators,
            // khPunctuations,
            // globalPunctuations,
            punctuations,
            all_words
        } = this.data;
        // paragraph = "កើតជាមនុស្សមានសាច់។កើតជាមនុស្សមានសាច់។";
        // paragraph = "។។។..";

        let paragraphPieces = paragraphChunks
            .map(chunks => {
                return chunks
                    .map(subChunks => {
                        let wordList = []; // array of word reading from paragraph
                        let bestMatch = ""; // latest match word while reading paragraph
                        let matchedWordList = {}; // all match word while read from first character until meet best match
                        let matchedWords = []; // store all match reference to best match
                        let readingObject = all_words;
                        let currentWord = "";
                        let currentChar = "";
                        let nextChar = "";

                        let charIndex = 0;
                        let nextCharIndex = 0;
                        while (charIndex < subChunks.length) {
                            currentChar = "";
                            currentChar = subChunks[charIndex];
                            nextChar = subChunks[charIndex + 1];

                            if (punctuations.includes(currentChar)) {
                                currentWord += currentChar;
                                if (!punctuations.includes(nextChar)) {
                                    wordList.push(currentWord);
                                    nextCharIndex += currentWord.length;
                                    charIndex = nextCharIndex;

                                    currentWord = "";
                                    readingObject = all_words;
                                } else {
                                    charIndex++;
                                }
                                nextCharIndex = charIndex;
                            } else if (
                                khConsonants.includes(currentChar) ||
                                khDependentVowels.includes(currentChar) ||
                                khIndependentVowels.includes(currentChar)
                            ) {
                                currentWord += currentChar;
                                if (khDependentVowels.includes(currentWord)) {
                                    wordList.push(currentChar);
                                    charIndex++;
                                    nextCharIndex = charIndex;
                                } else {
                                    readingObject = this.getObjectChild(
                                        readingObject,
                                        currentChar
                                    );

                                    if (readingObject.word) {
                                        bestMatch = readingObject.word;
                                        matchedWords.push(bestMatch);
                                    }

                                    if (!readingObject[nextChar]) {
                                        if (bestMatch) {
                                            matchedWordList[
                                                bestMatch
                                            ] = matchedWords;
                                        }
                                        wordList.push(bestMatch);
                                        nextCharIndex += bestMatch.length;
                                        charIndex = nextCharIndex;

                                        currentWord = "";
                                        bestMatch = "";
                                        matchedWords = [];
                                        readingObject = all_words;
                                    } else {
                                        charIndex++;
                                    }
                                }
                            } else {
                                currentWord += currentChar;

                                if (
                                    !nextChar ||
                                    khConsonants.includes(nextChar) ||
                                    khDependentVowels.includes(nextChar) ||
                                    khIndependentVowels.includes(nextChar) ||
                                    punctuations.includes(nextChar)
                                ) {
                                    wordList.push(currentWord);
                                    nextCharIndex += currentWord.length;
                                    charIndex = nextCharIndex;

                                    currentWord = "";
                                    readingObject = all_words;
                                } else {
                                    charIndex++;
                                }
                            }
                        }
                        return wordList.join("\u200b");
                    })
                    .join("\u200b");
            })
            .join(" ");
        return paragraphPieces;
    }
};

export default KhmerWordSegment;
// module.exports = KhmerWordSegment;
