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
        <button id="convertSseBtn" class="btn btn-primary" @click="convertSSE">Convert with SSE</button>
      </div>

    <div v-if="resultDisplay">
      <div v-if="resultData.errorCode === 0" class="box box-success">
        (Integer number) {{ integerResult }} => {{ resultData.data }} (Roman number)
      </div>
      <div v-else class="box box-alert">
        Error : {{ resultData.message }}
      </div>
    </div>
		<div v-if="loadDisplay" class="box box-load">
      please wait ...
    </div>
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
        errorCode: Number,
        message: String,
        data: String,
      },
      integerStr: "",
      integerResult: ""
    };
  },
	mounted() {
    let sseClient = this.$sse.create({
      url: 'http://localhost:8000/api/convert/sse/',
      format: 'json'
    });

    // Catch any errors (ie. lost connections, etc.)
    sseClient.on('error', (e) => {
      console.error('lost connection or failed to parse!', e);

      // If this error is due to an unexpected disconnection, EventSource will
      // automatically attempt to reconnect indefinitely. You will _not_ need to
      // re-add your handlers.
    });

    // Handle messages without a specific event
    sseClient.on('message', this.handleSSEResult);


    sseClient.connect()
      .then(sse => {
        // console.log('SSE client connected !');
      })
      .catch((err) => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        console.error('Failed to connect to server', err);
				this.resultError({message: 'Failed to connect to server'});
      });
  },
  methods: {
		convertSSE() {
			if(this.validateInput()){
				this.clickDisplay();
				axios
					.get(`http://localhost:8000/api/convert/sse/toroman/${this.integerStr}`)
					.catch((err) => this.resultError(err))
					;
			}
    },
		handleSSEResult(res) {
			if(res.errorCode === 0){
				this.resultSuccess(res);
			}
			else{
				this.resultError(res);
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
  },
	beforeDestroy() {
    // Make sure to close the connection with the events server
    // when the component is destroyed, or we'll have ghost connections!
    sseClient.disconnect();

    // Alternatively, we could have added the `sse: { cleanup: true }` option to our component,
    // and the SSEManager would have automatically disconnected during beforeDestroy.
  },
};
</script>
