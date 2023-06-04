import React from 'react'
import axios from 'axios'
import { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
// import { useLocation } from 'react-router-dom';
import UserContext from '../context/UserContext'

const ChatRoom = () => {
  const loggedInUserId = useContext(UserContext)

  const [validToken, setValidToken] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  const [answerRecipientId, setAnswerRecipientId] = useState(null)
  const [answerRecipientMessage, setAnswerRecipientMessage] = useState('');
  const [answer, setAnswer] = useState(false)

  const [users, setUsers] = useState([]) // profile är för att hämta befintliga värden i databasen
  // const [initialProfile, setInitialProfile] = useState({}) // initialProfile är också värden från databasen, sparas även här för att kunna behålla vården i placeholdern.

   // Kolla så att ett giltigt token finns
   useEffect(() => {
    const checkToken = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8900/check-token',
                {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                }
            )

            if (response.status === 200) {
                setValidToken(true)
            }
        } catch (error) {
            setValidToken(false)
        }
    }
    checkToken()
    console.log(validToken)
    }, [])

    useEffect(() => {
      const fetchUser = async () => {
          try {
              const res = await axios.get(
                  `http://localhost:8900/users`
              )
              setUsers([res.data])
              console.log(users)
          } catch (err) {
              console.log(err)
          }
      }
      fetchUser()
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/messages`)
        setMessages(result.data)
      } catch (error) {
        setError(true)
        console.error(error)
      }
    }
    fetchMessages()
    console.log(messages)
    console.log(loggedInUserId)
  }, [])

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

    const messageData = {
      sender_id: loggedInUserId,
      recipient_id: newMessage.recipient_id,
      message: newMessage.message
    }

    axios
      .post(`http://localhost:8900/messages`, messageData)
      .then((response) => {
        const { message_id } = response.data
        console.log(response.data)
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            message_id
          }
        ])
        event.target.reset()
        console.log(messages)
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const handleDelete = async (event, messageId) => {
    event.preventDefault()
    try {
      await axios.delete(`http://localhost:8900/messages/${messageId}`)
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.message_id !== messageId)
      )
      console.log(messageId)
      console.log('Message deleted')
    } catch (error) {
      console.error(error)
    }
  }

  const handleAnswer = async (event, recipientId, recipientMessage) => {
    event.preventDefault()
    setAnswer(true)
    setAnswerRecipientId(recipientId)
    setAnswerRecipientMessage(recipientMessage)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId
    }))
  }

  return (
    <>
    {validToken ? (
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
                  <button
                    type="button"
                    onClick={(event) => handleDelete(event, message.message_id)}
                  >
                    Ta bort
                  </button>
                  <button
                    type="button"
                    onClick={(event) =>
                      handleAnswer(
                        event,
                        message.recipient_id,
                        message.message
                      )
                    }
                  >
                    Svara
                  </button>
                </div>
              ))}
            </div>
            <form method="post" onSubmit={handleSubmit}>
              {answer && `Svara ${answerRecipientId} ${answerRecipientMessage}`}
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
      ) : (
        <h1>Vänligen logga in</h1>
    )}
    </>

  )
}

export default ChatRoom

const ChatBg = styled.div`
  display: flex;
  justify-content: center;
  height: 80vh;
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
