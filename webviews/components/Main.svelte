<!-- ChatBox.svelte -->

<script>
	const vscode = acquireVsCodeApi();
	import { onMount, afterUpdate} from 'svelte';
  
    let messages = [];
	let inputValue = '';
	let messageContainer;
	let contentEditable;
   
	// let all =  vscode.workspace.getConfiguration();

    // let allAsJSON = JSON.parse(JSON.stringify(all));  // the key line
    // const editorSettings = allAsJSON.editor;
	// const editorFontSizeSetting = editorSettings.fontSize;  // 14
	// console.error("The Value from setting.json is:" + editorFontSizeSetting);

	function getApiKey() {
     return vscode.workspace.getConfiguration().get('yourExtension.apiKey', '');
    }
	

	function formatTimestamp() {
		const options = { hour: 'numeric', minute: '2-digit', hour12: true };
		const timeString = new Date().toLocaleTimeString(undefined, options);
		const [time, meridiem] = timeString.split(' ');

		return `${time} ${meridiem.charAt(0).toUpperCase()}.${meridiem.charAt(1).toUpperCase()}`;
    }
  

    afterUpdate(() => {
        // Adjusting the height of the chatbox as more messages are added
        scrollToBottom();
		document.getElementById("contentEditable").focus();
     });
	onMount(() => {
	// Handle the message inside the webview
	window.addEventListener('message', event => {		
		const message = event.data; // The JSON data our extension sent
		switch (message.type) {
			case 'response':
			const newMessage = {
				content: message.result,
				role: "assistant", // For distinguishing user's messages
				timeStamp:formatTimestamp()
			};
			messages = [...messages, newMessage];
		}
	});

    // Example: Initialize with a welcome message
    const welcomeMessage = {
      content: 'Welcome to the chat! This is a helpful comrade how will help programmers to assit in coding.',
      role: "system",
	  timeStamp:formatTimestamp()
    };
    messages = [welcomeMessage];
  });

	function sendMessage() {
		console.log("The time stamp is", formatTimestamp());
		const newMessage = [
			{
				content: 'Welcome to the chat! This is a helpful comrade who will help programmers to assit in coding.',
				role: "system",
			},
			{
				content: inputValue,
				role: "user", // For distinguishing user's messages
			}
	    ];
		messages = [...messages, 	{
				content: inputValue,
				role: "user", 
				timeStamp:formatTimestamp()
			}];
        
		//contentEditable.focus();
		//Adjusting the height of the chatbox as more messages are added
		setTimeout(() => {
        // Adjusting the height of the chatbox as more messages are added
            scrollToBottom();
			document.getElementById("contentEditable").focus();
         },50);

		const content = document.getElementById('contentEditable');
        content.textContent=""
    	inputValue = ''; // Clear the input box after sending the message

	 	 vscode.postMessage({
			command: 'sendMessage',
			text: newMessage
	  	});
	}

	//To adjust the view as more messages are added to the chatbox.
	function scrollToBottom(){
		//Adjusting the height of the chatbox as more messages are added
	    const messages = document.getElementById('scrollerContent');
        const latestMessage = messages.lastElementChild;

        if (latestMessage) {
            latestMessage.scrollIntoView({ behavior: 'smooth', block: "end" });
        }  
    }

    //Get's Triggered as the user is typing
	function updateContentHeight(event) {
	  //Handling the input 
	  inputValue = event.target.innerText;
	  const content = document.getElementById('contentEditable');
	  content.style.height = 'auto';
	  content.style.height = `${content.scrollHeight}px`;
	}
	// #007acc blue color
  </script>
  

  <index>
	<!-- list of messages -->
	
	<div style="overflow-y: auto; padding: 10px; height: 92vh;" class="" bind:this={messageContainer}>
		<div class="" id="scrollerContent">
		  {#each messages as message (message.content)}
		  <div style="margin: 5px; padding: 8px; border-radius: 5px; background-color: #333333; color: #fff; position: relative;" class="">
			<div>
			  {message.content}
			</div>
			<div style="font-size: 0.5em; color: rgba(255, 255, 255, 0.7); position: absolute; bottom: 5px; right: 5px; opacity:0.3;" class="timestamp">{message.timeStamp}</div>
		  </div>
		  {/each}
		</div>
	</div>
	  
	
  <main style="display: flex; position: fixed; bottom: 0; width: 100%;">
    
	<!-- input box to send message -->
	<div
	  bind:this={contentEditable}
	  id="contentEditable"
	  contenteditable
	  style="border-radius:4px; margin-left: 3px; width: 90%; height: 30px; border: 1px solid #007acc; cursor: text; outline: none; padding: 5px; box-sizing: border-box; overflow-y: hidden; resize: none; background-color: #333333"
	  on:input={updateContentHeight}
	  on:keydown={event => event.key === 'Enter' && sendMessage()}
	>
	{inputValue}
    </div>
	<button on:click={sendMessage} style="border-radius:4px; margin-left: 3px; width: 10%; height: 30px;">
	  <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
		<path d="M1 1.91L1.78 1.5L15 7.44899V8.3999L1.78 14.33L1 13.91L2.58311 8L1 1.91ZM3.6118 8.5L2.33037 13.1295L13.5 7.8999L2.33037 2.83859L3.6118 7.43874L9 7.5V8.5H3.6118Z" />
	  </svg>
	</button>
  </main>
</index>
  
  <style>
		
  div[contenteditable]::before {
	content: attr(placeholder);
	display: block;
	padding: 5px;
	content: attr(placeholder);
	color: white; /* Placeholder text color */
  }
  </style>
  