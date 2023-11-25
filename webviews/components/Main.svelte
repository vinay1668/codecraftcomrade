<!-- ChatBox.svelte -->
<script>
	let inputValue = '';
	
	function sendMessage() {
	  // Use the VS Code API to send a message to your extension
	  vscode.postMessage({
		command: 'sendMessage',
		text: inputValue
	  });
	}
  </script>
  
  <style>
	/* Add your styles here */
  </style>
  
  <div>
	<input bind:value={inputValue} placeholder="Type here...">
	<button on:click={sendMessage}>Send</button>
  </div>
  