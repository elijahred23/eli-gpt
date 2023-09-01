import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';

import './ChatApp.css';


const ChatApp = () => {
	const [chatHistory, setChatHistory] = useState([]);
	const [userInput, setUserInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const apiKey = '';

	const generateResponse = async (userInput) => {
		const apiUrl = 'https://api.openai.com/v1/chat/completions';
		const messages = [{ role: 'user', content: userInput }];

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				messages,
				model: 'gpt-3.5-turbo',
			}),
		});

		const responseData = await response.json();
		const chatGPTResponse = responseData.choices[0].message.content;
		console.log(chatGPTResponse);
		return chatGPTResponse;
	};

	const handleUserInput = async () => {
		if (userInput.trim() === '') return;

		setIsLoading(true);
		const response = await generateResponse(userInput);
		setChatHistory([
			...chatHistory,
			{ sender: 'You', message: userInput },
			{ sender: 'EliGPT', message: response },
		]);
		setUserInput('');
		setIsLoading(false);
	};

	const handleKeyPress = (event) => {
		if (event.key === 'Enter') {
			handleUserInput();
		}
	};
	const handleDownloadPDF = () => {
		const doc = new jsPDF();
		const chatText = chatHistory
			.map((message) => `${message.sender}: ${message.message}`)
			.join('\n');

		doc.text(chatText, 10, 10);
		doc.save('chat_history.pdf');
	};


	return (
		<div className="chat-container">
			<h1 className="app-title">EliGPT</h1>
			<div className="chat-history">
				{chatHistory.map((message, index) => (
					<div key={index} className={`message ${message.sender.toLowerCase()}`}>
						<span className="sender">{message.sender}: </span>
						<ReactMarkdown className="message-text">{message.message}</ReactMarkdown>

					</div>
				))}
			</div>
			<div className="user-input">
				<input
					type="text"
					placeholder="Type your message..."
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<button onClick={handleUserInput} disabled={isLoading}>
					{isLoading ? 'Loading...' : 'Send'}
				</button>
				<button onClick={handleDownloadPDF}>Download Chat as PDF</button>
			</div>
		</div>
	);
};

export default ChatApp;
