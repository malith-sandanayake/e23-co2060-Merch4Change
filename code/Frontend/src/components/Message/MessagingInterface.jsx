import { useEffect, useMemo, useState } from "react";
import "./MessagingInterface.css";
import Navbar from "../Navbar/Navbar";

import {
    ensureGuestUserSession,
	getActiveUser,
	getContacts,
	getConversation,
	sendMessageAndComputeReply,
} from "../services/messagingService";

function MessagingInterface({ onNavigate }) {
	{/*
		Core state variables:
		- activeUser		: The currently signed-in user (or guest)
		- contacts			: List of available contacts
		- selectedContactId	: ID of the currently selected contact
		- messages			: List of messages in the current conversation
		- draft				: Text content of the message being composed
		- isSending			: Flag to indicate if a message is currently being sent
	*/}
	const [activeUser, setActiveUser] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [selectedContactId, setSelectedContactId] = useState("");
	const [messages, setMessages] = useState([]);
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);

	useEffect(() => {
		{/* On component mount, initialize the user session and load contacts/conversations */}
		const currentUser = getActiveUser() || ensureGuestUserSession();
		setActiveUser(currentUser);

		if (!currentUser) {
			return;
		}

		const availableContacts = getContacts(currentUser.id);
		setContacts(availableContacts);

		if (availableContacts.length > 0) {
			const firstContactId = availableContacts[0].id;
			setSelectedContactId(firstContactId);
			setMessages(getConversation(currentUser.id, firstContactId));
		}
	}, []);
	
	{/* Compute the currently selected contact's details based on the selectedContactId */}
	const selectedContact = useMemo(
		() => contacts.find((contact) => contact.id === selectedContactId) || null,
		[contacts, selectedContactId]
	);

	{/* Handler for when a contact is selected from the sidebar */}
	const handleContactSelect = (contactId) => {
		setSelectedContactId(contactId);
		if (!activeUser) {
			return;
		}
		setMessages(getConversation(activeUser.id, contactId));
	};

	{/* Handler for sending a message.
		It validates the input, sends the message, and updates the conversation with the reply. */}
	const handleSendMessage = async (event) => {
		{/* Prevent the default form submission behavior. that is refreshing or reloading the page*/}
		event.preventDefault();
		if (!activeUser || !selectedContactId || !draft.trim() || isSending) {
			return;
		}

		setIsSending(true);

		{/* Send the message to the backend and compute the reply.
			The backend is expected to return the updated conversation messages. */}
		{/* This part is simulated until account creation and real backend integration is done */}
		const result = await sendMessageAndComputeReply({
			fromUserId: activeUser.id,
			toUserId: selectedContactId,
			content: draft,
		});

		{/* If the backend returns an error, alert the user and reset the sending state.
			Otherwise, update the messages with the new conversation. */}
		if (!result.success) {
			alert(result.error);
			setIsSending(false);
			return;
		}

		setMessages(result.messages);
		setDraft("");
		setIsSending(false);
	};

	{/* If there is no active user (which should not happen due to the session initialization), 
		render nothing. This is a safety check to prevent rendering the messaging interface without a valid user session.*/}
	if (!activeUser) return null;

	{/*The main JSX structure of the messaging interface.
		It consists of a sidebar for contacts and a main section for the conversation.
		The sidebar allows the user to select different contacts,
		while the main section displays the conversation and provides an input form for sending messages. */}
	return (	
        <>
			{/* Navigation bar with a callback for navigation actions (e.g., going back to home or profile) */}
			<Navbar onNavigate={onNavigate}/>
			<div className="messaging-shell">
				{/* Sidebar section displaying the active user's name and a list of contacts to chat with */}
				<aside className="messaging-sidebar">
					<h3>Signed in as</h3>
					<p className="active-user-name">{activeUser.name}</p>
					<div className="contact-list">
						{/* Render a button for each contact. The selected contact is highlighted. */}
						{contacts.map((contact) => (
							<button
								key={contact.id}
								className={`contact-item ${
									selectedContactId === contact.id ? "selected" : ""
								}`}
								onClick={() => handleContactSelect(contact.id)}
							>
								{contact.name}
							</button>
						))}
					</div>
				</aside>

				{/* Main section displaying the conversation with the selected contact and an input form for sending messages */}
				<section className="messaging-main">
					<header className="message-header">
						<h3>{selectedContact ? `Chat with ${selectedContact.name}` : "No contact selected"}</h3>
						<p>Replies are computed by the server</p>
					</header>

					<div className="message-list">
						{messages.length === 0 ? (
							<p className="empty-text">Start a conversation.</p>
						) : (
							messages.map((message) => {
								const isOwnMessage = message.fromUserId === activeUser.id;

								return (
									<div
										key={message.id}
										className={`message-row ${isOwnMessage ? "own" : "other"}`}
									>
										<p>{message.text}</p>
									</div>
								);
							})
						)}
					</div>

					<form className="message-input-form" onSubmit={handleSendMessage}>
						<input
							type="text"
							value={draft}
							onChange={(event) => setDraft(event.target.value)}
							placeholder="Type your message"
						/>
						<button className="messaging-button" type="submit" disabled={isSending}>
							{isSending ? "Sending..." : "Send"}
						</button>
					</form>
				</section>
				
			</div>
    	</>
	);
}

export default MessagingInterface;