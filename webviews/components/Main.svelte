<!-- ChatBox.svelte -->

<script>
    const vscode = acquireVsCodeApi();
	
	let inputValue = '';
	function sendMessage() {
      
	  //console.log(inputValue)
	  //runCompletion();
	  // Use the VS Code API to send a message to your extension
	  vscode.postMessage({
		command: 'sendMessage',
		text: inputValue
	  });

	}
  </script>
  
  <style>
  </style>
  
  <main style="display: flex; position: fixed; bottom: 0; width: 100%;">
	<textarea bind:value={inputValue} placeholder="Type here..." style="margin-left:3px;width: 90%; height:30px"></textarea>
	<button on:click={sendMessage} style="margin-left:3px;width: 10%;height:30px">
		<svg height="20" width="20" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg"><path d="m0 0v5l1-1h1v-3h3v-1zm3 2v4h4l1 1v-5z"/></svg>
	</button>
  </main>
  