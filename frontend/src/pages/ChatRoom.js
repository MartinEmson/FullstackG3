import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { AuthContext } from '../context/AuthContext'

const ChatRoom = () => {
  const chatBottomRef = useRef(null)
  const { loggedInUserId } = useContext(AuthContext)

  const [validToken, setValidToken] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  // const [answerRecipientMessage, setAnswerRecipientMessage] = useState('')
  const [answer, setAnswer] = useState(false)
  const [senders, setSenders] = useState([])
  const [answerName, setAnswerName] = useState('')
  const [replyingToMessage, setReplyingToMessage] = useState(null);
// const [replyingToSender, setReplyingToSender] = useState(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages]) // Trigger the effect whenever the messages state changes

  // Kolla så att ett giltigt token finns
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:8900/check-token', {
          headers: {
            token: localStorage.getItem('token')
          }
        })

        if (response.status === 200) {
          setValidToken(true)
        }
      } catch (error) {
        setValidToken(false)
      }
    }
    checkToken()
  }, [validToken])

  useEffect(() => {
    const fetchSenders = async () => {
      try {
        const result = await axios.get(`http://localhost:8900/users`)
        setSenders(result.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchSenders()
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
  }, [loggedInUserId])

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
      message: `${newMessage.message} (Replying to: ${replyingToMessage})`,
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
            message: `${newMessage.message} (Replying to: ${replyingToMessage})`,
            message_id
          }
        ])
        setAnswer(false)
        event.target.reset()
        setReplyingToMessage(null);
        // setReplyingToSender(null);

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

  //Handle Replay-button.
  const handleAnswer = async (
    event,
    recipientId,
    answerName,
    recipientMessage
  ) => {
    event.preventDefault()
    setAnswer(true)
    setAnswerName(answerName)
    // setAnswerRecipientMessage(recipientMessage)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId
    }))
    setReplyingToMessage(recipientMessage);
    // setReplyingToSender(answerName);
    console.log(recipientId)
  }

  // const loggedIn = localStorage.getItem('loggedInUserId')

  return (
    <>
      {validToken ? (
        <ChatBg>
          <ChatWindow>
            <LeftSide></LeftSide>
            <RightSide>
              <div className="message-wrapper">
                {messages.map((message) => {
                  const sender = senders.find(
                    (user) => user.user_id === message.sender_id
                  )
                  const isUserMessage = message.sender_id === loggedInUserId
                  const isDeleteButtonVisible = isUserMessage
                  // const isReplyToLoggedInUser = message.recipient_id === loggedInUserId;
                  // const isReplyingToThisMessage = replyingToMessage === message.message && replyingToSender === sender.user_firstname;

                  return (
                    <MessageContainer
                      key={message.message_id}
                      className="messageWrapper"
                      isUserMessage={isUserMessage}
                    >
                      <div className="senderInfo">
                        <img
                          src={sender.image}
                          alt="Profile"
                          className="profileImage"
                        />
                        <p className="senderName">{sender.user_firstname}</p>
                      </div>
                      <div className="theMessageWrapper">
                      {/* {isReplyingToThisMessage && (
          <p className="replyingToMessage">
            Replying to: {replyingToSender} - {replyingToMessage}
          </p>
        )} */}
                        <p className="theMessage">{message.message}</p>
                      </div>
                      <div className="buttonWrapper">
                        {isDeleteButtonVisible && (
                          <button
                            type="button"
                            onClick={(event) =>
                              handleDelete(event, message.message_id)
                            }
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(event) =>
                            handleAnswer(
                              event,
                              message.recipient_id,
                              sender.user_firstname,
                              message.message
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>
                    </MessageContainer>
                  )
                })}
              </div>
              <div className="formWrapper">
                <form method="post" onSubmit={handleSubmit} className="form">
                  {answer && (
                    <div className="ifAnswer">
                      <p>Answer {answerName}</p>
                    </div>
                  )}
                  <input
                    type="text"
                    name="message"
                    onChange={handleChange}
                    placeholder="Write someting.."
                  />
                  <button type="submit" className="submitButton">
                    Send
                  </button>
                  <div ref={chatBottomRef} />
                  {error && <p>Something went wrong, please try again.</p>}
                </form>
              </div>
            </RightSide>
          </ChatWindow>
        </ChatBg>
      ) : (
        <h1>Please log in first</h1>
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
  font-family: Inter, sans-serif;
`
const ChatWindow = styled.div`
  background-color: white;
  width: 90vw;
  height: 80vh;
  margin-top: 5vh;
  margin-bottom: 5vh;
  border-radius: 15px;
  overflow-y: scroll;
`

const LeftSide = styled.div``
const RightSide = styled.div`
  .formWrapper {
    display: flex;
    height: 10vh;
    border-top: solid #d9d9d9 0.5px;
    padding: 0.2vh 0 0 0;
  }

  input {
    border: none;
    width: 60vw;
  }

  input[type='text'] {
    width: 60vw;
    padding: 4vh 0 0 4vw;
  }

  input[type='text']:focus {
    outline-color: transparent;
    max-width: 60vw;
  }

  .submitButton {
    border: none;
    background-color: transparent;
    margin: 0 0 0 6vw;
    cursor: pointer;
  }

  .ifAnswer {
    font-size: 12px;
    color: grey;
    margin: 0;
    padding: 0;
  }

  .ifAnswer p {
    margin: 0.5vh 0 0 1vw;
  }

  .senderInfo {
    display: flex;
    flex-direction: row;
  }

  .profileImage {
    height: 40px;
    width: 40px;
    margin: 0 0 0 1vw;
    padding: 0 0 1vh 0;
  }

  .senderName {
    padding: 1vh 0 0 1vw;
    margin: 0;
  }

  .theMessage {
    margin: 0;
    word-wrap: break-word;
    max-width: 60vw;
  }

  .theMessageWrapper {
    background: #d9d9d9;
    border-radius: 30px;
    padding: 1.5vh 4vw 1.5vh 4vw;
    margin: 0 0 0 3vw;
    max-width: 60vw;
    /* align-self: ${({ isUserMessage }) =>
      isUserMessage ? 'flex-end' : 'flex-start'}; */
  }
`
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 3vh 0;

  .buttonWrapper {
    margin-left: 3vw;
  }

  button {
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 1vw;
    cursor: pointer;
  }
`
