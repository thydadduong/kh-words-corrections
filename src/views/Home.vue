<template>
  <div>
    <div class="card mb-4">
      <div class="card-header">
        <!-- eslint-disable-next-line -->
        <p class="card-text">បញ្ចូលឃ្លា ឬ​ប្រយោគៈ</p>
      </div>
      <div class="card-body">
        <!-- eslint-disable-next-line -->
        <!-- placeholder="បញ្ចូល​ពាក្យ​ត្រង់នេះ..." -->
        <textarea rows="5" class="form-control" v-model="editingWords" />
      </div>
      <div class="card-footer">
        <div class="btn-group" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-outline-dark" @click="findIncorrectWords">
            <!-- eslint-disable-next-line -->
            ពិនិត្រ​អក្ខរាវិរុទ្ធ
          </button>
          <!-- eslint-disable-next-line -->
          <button type="button" class="btn btn-outline-dark" @click="resetTextFormat">ជម្រះ</button>
          <!-- eslint-disable-next-line -->
          <button type="button" class="btn btn-outline-dark">ដាក់ ZWSP</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">លទ្ធផល</div>
      <div class="card-body">
        <div id="word-preview">
          {{splitedWord}}
          <div v-html="checkedWords" />
          <!-- <div v-html="findIncorrectWords()"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "home",
  components: {},
  data() {
    return {
      editingWords:
        "មួយ​ប៉​ព្រិច​ភ្នែក​សោះ​ ពេលនេះ​អ្នក​បាន​ដើរ​ដល់​ចំណុច​កណ្តាល​នៃ​ផ្លូវ​ហើយ​ នៅសល់​ពាក់កណ្តាល​ទៀត​អ្នក​អាច​ត្រឡប់ទៅវិញ​ហើយ​។​ មួយឆ្នាំ​អាច​ថា​លឿន​ តែ​ក៏អាច​ជា​យឺត​ដែរ​។ មួយឆ្នាំ​កន្លង​នេះ​មានរឿង​ជាច្រើន​ដែល​បាន​កើតឡើង​ មាន​ទាំង​ល្អ​ទាំង​អាក្រក់​បញ្ហា​មិនមែន​សុទ្ធតែ​អាក្រក់​នោះ​ទេ​ តែបើ​យើង​អាច​រក​វិធី​ដោះ​ស្រាយ​បាន​វា​នឹង​ផ្តល់​បទ​ពិសោធ​ន៍​ល្អ​ៗ​ដល់​យើង​។​ ចំណាំ​៖ តែបើ​បញ្ហា​កើត​ច្រើនពេក​ក៏​មិន​ចូលចិត្ត​ដែរ",
      khWords: "",
      missignWords: [],
      checkedWords: "",
      splitedWord: []
    };
  },
  methods: {
    findIncorrectWords() {
      this.missignWords = [];
      const wordsToCheck = this.splitWord() || [];
      this.splitedWord = wordsToCheck;
      wordsToCheck.forEach(word => {
        let firstChar = word.charAt(0);
        try {
          let wordsToCompare = require("../assets/group_words/" +
            firstChar +
            ".json");
          if (!wordsToCompare.includes(word)) {
            this.missignWords.push(word);
          }
        } catch (error) {
          let wordsToCompare = require("../assets/group_words/others.json");
          if (!wordsToCompare.includes(word)) {
            this.missignWords.push(word);
          }
        }
      });
      if (this.missignWords.length) {
        this.checkedWords = this.applyErrorFormat();
      } else {
        this.checkedWords = "";
      }
    },
    applyErrorFormat() {
      let errorRegex = "";

      this.missignWords.forEach(word => {
        errorRegex += word.replace(/[<>*()?]/g, "\\$&") + "|";
      });

      errorRegex = errorRegex.slice(0, -1);

      return this.editingWords.replace(new RegExp(errorRegex, "g"), match => {
        return '<span class="highlightText">' + match + "</span>";
      });
    },
    splitWord() {
      const words = this.editingWords
        .replace(/\s+/g, "\u200B")
        .replace(/\u200B+/g, "\u200B")
        .split("\u200B");
      const uniqueWords = words.filter(
        (val, i, self) => self.indexOf(val) === i
      );

      return uniqueWords;
    },
    resetTextFormat() {
      this.checkedWords = "";
    }
  }
  // computed: {
  //   splitWord() {
  //     const words = this.editingWords
  //       .replace(/\s+/g, "\u200B")
  //       .replace(/\u200B+/g, "\u200B")
  //       .split("\u200B");
  //     const uniqueWords = words.filter(
  //       (val, i, self) => self.indexOf(val) === i
  //     );
  //     return uniqueWords;
  //   }
  // }
};
</script>

<style lang="scss">
#word-preview {
  min-height: 14rem;
}

.highlightText {
  background: yellow;
}
</style>

