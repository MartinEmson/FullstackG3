import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
// import { useLocation } from 'react-router-dom';

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  const [answerRecipientId, setAnswerRecipientId] = useState(null);
  const [answerRecipientName, setAnswerRecipientName] = useState('');
  const [answer, setAnswer] = useState(false)

  const loggedInUserId = props.loggedInUserId;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/messages/${loggedInUserId}`)
        setMessages(result.data)
      } catch (error) {
        setError(true)
        console.error(error)
      }
    }
    fetchMessages()
    console.log(messages)
  }, [loggedInUserId]);

  const [newMessage, setNewMessage] = useState({
    sender_id: loggedInUserId,
    recipient_id: null,
    message: ''
  })

  const handleChange = (event) => {
    setNewMessage({
      ...newMessage,
      [event.target.name]: event.target.value
    })
    console.log(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    axios
      .post(`http://localhost:8900/messages/${loggedInUserId}`, newMessage)
      .then((response) => {
        const { message_id } = response.data;
        console.log(response.data)
        setMessages((prevMessages) => [...prevMessages, { ...newMessage,
          sender_id: loggedInUserId,
          message_id  },
        ]);
        // setNewMessage({
        //   sender_id: '',
        //   recipient_id: '',
        //   message: ''
        // })
        event.target.reset()
        console.log(messages)
        console.log(response.data)

      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (event, messageId) => {
    event.preventDefault();
    try {
     await axios.delete(`http://localhost:8900/messages/${loggedInUserId}/${messageId}`)
        setMessages((prevMessages) =>
        prevMessages.filter((message) => message.message_id !== messageId)
        );
        console.log(messageId)
        console.log('Message deleted')

    } catch(error) {
        console.error(error)
      }
  };

  const handleEdit = async(event) => {
    event.preventDefault();
  };

  const handleAnswer = async(event, recipientId, recipientName) => {
    event.preventDefault();
    setAnswer(true)
    setAnswerRecipientId(recipientId)
    setAnswerRecipientName(recipientName)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId
    }));
  };

  return (
    <>
      <ChatBg>
        <ChatWindow>
          <LeftSide></LeftSide>
          <RightSide>
            <div className="message-wrapper">
              {messages.map((message) => (
                <div key={message.message_id} className="message">
                  <p className="theMessage">
                    {message.message}
                    {message.sender_id}
                    {message.recipient_id}
                    {message.message_id}
                  </p>
                  <button type="button" onClick={(event) => handleDelete(event, message.message_id)}>
                    Ta bort
                  </button>
                  <button type="button" onClick={(event) => handleEdit(event, message.message_id)}>
                    Ändra
                  </button>
                  <button type="button" onClick={(event) => handleAnswer(event, message.recipient_id, message.recipient_name)}>
                    Svara
                  </button>
                </div>
              ))}
            </div>
            <form method="post" onSubmit={handleSubmit}>
            {answer && `Svara ${answerRecipientId}`}
              <input
                type="text"
                name="message"
                onChange={handleChange}
                placeholder="Skriv ditt meddalande här"
              />
              <button type="submit">Skicka</button>
              {error && <p>Något blev fel, försök igen.</p>}
            </form>
          </RightSide>
        </ChatWindow>
      </ChatBg>
    </>
  )
}

export default ChatRoom

const ChatBg = styled.div`
  background: linear-gradient(
    180.04deg,
    #fbbaa6 0.03%,
    rgba(255, 0, 0, 0.42) 202.92%
  );
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
`
const ChatWindow = styled.div`
  background-color: white;
  width: 1000px;
  height: 500px;
  margin-top: 150px;
  margin-bottom: 150px;
  border-radius: 15px;
  overflow-y: scroll;
`
const LeftSide = styled.div``
const RightSide = styled.div``
