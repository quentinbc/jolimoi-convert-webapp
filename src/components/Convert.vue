<template>
  <div class="container">
    <h3>Convert</h3>

      <div class="form-group">
        <label for="name">Convert an integer to a Roman numeral</label>
        <input
          type="number"
          class="form-control"
          id="integerStr"
          placeholder="Choose an integer between 0 to 100"
          v-model="integerStr"
        />
      </div>
      <div class="form-group">
        <button id="convertBtn" class="btn btn-primary" @click="convert">Convert</button>
      </div>

    <template v-if="resultDisplay">
      <div v-if="resultData.errorCode === 0" class="box box-success">
        (Integer number) {{ integerResult }} => {{ resultData.data }} (Roman number)
      </div>
      <div v-else class="box box-alert">
        Error : {{ resultData.message }}
      </div>
    </template>

		<template v-if="loadDisplay">
		<div class="box box-load">
      please wait ...
    </div>
		</template>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Convert",
  data() {
    return {
      resultDisplay: false,
			loadDisplay:false,
      resultData: {
        errorCode: 0,
        message: "",
        data: "",
      },
      integerStr: "",
      integerResult: ""
    };
  },
	mounted() {
   
  },
  methods: {
    convert() {
			if(this.validateInput()){
				this.clickDisplay();
				axios
					.get(`http://localhost:8000/api/convert/toroman/${this.integerStr}`)
					.then((res) => this.resultSuccess(res.data))
					.catch((err) => this.resultError(err))
					;
			}
    },
    resultSuccess(res) {
      this.resultData = res;
			this.initDisplay();
    },
    resultError(err) {
			const error = err.response && err.response.data ? err.response.data : err;
			this.resultData = {
					errorCode: error.errorCode || 2,
          message: error.message || "Sorry we have an error",
          data: "",
      };
			this.initDisplay();
    },
		clickDisplay(){
			this.resultDisplay = false;
			this.loadDisplay = true;
		},
		validateInput(){
			if(this.integerStr.length === 0 || this.integerStr < 0 || this.integerStr > 100){
				this.resultError({errorCode:3, message:"Please write an integer between 0 to 100 in the input"});
				return false;
			}
			return true;
		},
		initDisplay(){
			this.integerResult = this.integerStr;
			this.integerStr = "";
			this.loadDisplay = false;
      this.resultDisplay = true;
		}
  }
};
</script>
