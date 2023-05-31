import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get('http://localhost:8900/messages')
        setMessages(result.data)
      } catch (error) {
        setError(true)
        console.error(error)
        console.log('is not working')
      }
    }
    fetchMessages()
    console.log(messages)
  }, [])

  const { id } = useParams();

  const [newMessage, setNewMessage] = useState({
    sender_id: id,
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
      .post('http://localhost:8900/messages', newMessage)
      .then((response) => {
        console.log(response.data)
        setMessages((prevMessages) => [...prevMessages, { ...newMessage,
          sender_id: id,
          message_id: response.data.message_id  },
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


  //Funkar
  const handleDelete = async (event, id) => {
    event.preventDefault();
    try {
     await axios.delete(`http://localhost:8900/messages/${id}`)
        setMessages((prevMessages) =>
        prevMessages.filter((message) => message.message_id !== id)
        );
        console.log(id)
        console.log('Message deleted')

    } catch(error) {
        console.error(error)
      }
  };

  const handleEdit = async(event) => {
    event.preventDefault();
  };

  const handleAnswer = async(event) => {
    event.preventDefault();
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
                  <button type="button" onClick={(event) => handleAnswer(event, message.message_id)}>
                    Svara
                  </button>
                </div>
              ))}
            </div>
            <form method="post" onSubmit={handleSubmit}>
              <input
                type="text"
                name="sender_id"
                onChange={handleChange}
                placeholder="Sender"
              />
              <input
                type="text"
                name="recipient_id"
                onChange={handleChange}
                placeholder="Recipient"
              />
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
