import React, { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { AuthContext } from '../context/AuthContext'

const ChatRoom = () => {

  const { loggedInUserId } = useContext(AuthContext);
  const chatBottomRef = useRef(null);

  const [validToken, setValidToken] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(false)
  const [answer, setAnswer] = useState(false)
  const [senders, setSenders] = useState([])
  const [answerName, setAnswerName] = useState('')
  const [recipientId, setRecipientId] = useState(null)
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  // const [replyingToMessageId, setReplyingToMessageId] = useState(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Trigger the effect whenever the messages state changes


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
      } catch (error) {
        console.log(error)
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
  }

  const handleSubmit = (event) => {
    event.preventDefault()


    const messageData = {
      sender_id: loggedInUserId,
      recipient_id: recipientId,
      message: newMessage.message,
    }

    axios
      .post(`http://localhost:8900/messages`, messageData)
      .then((response) => {
        const { message_id } = response.data
        console.log(response.data)
        console.log(messageData)

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            message_id,
          },
        ]);


        setAnswer(false)
        setReplyingToMessage(null);
        setRecipientId(null)
        event.target.reset()

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
    recipientMessage,
  ) => {
    event.preventDefault()
    setAnswer(true)
    setAnswerName(answerName)


    const repliedMessage = messages.find((message) => message.message === recipientMessage)
    setRecipientId(repliedMessage.sender_id)
    setNewMessage((prevMessage) => ({
      ...prevMessage,
      recipient_id: recipientId,
    }))

    console.log(repliedMessage.sender_id)
    console.log(recipientMessage)
  }

  //When clicking on X All the data related to Reply is reset.
  const removeRecipient = async () => {
    setAnswer(false)
    setAnswerName('')
    setNewMessage(null)
    setRecipientId(null)
  }

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
                  const isReplyMessage = replyingToMessage === message.message; // Check if the current message is a reply

                  return (
                     <MessageContainer
                      key={message.message_id}
                      className="messageWrapper"
                      isUserMessage={isUserMessage}
                    >
                      {!isUserMessage ? <div className="senderInfo">
                        <img
                          src={sender.image}
                          alt="Profile"
                          className="profileImage"
                        />
                        <p className="senderName">{sender.user_firstname}</p>
                      </div> : <div className="senderInfo">
                        <p className="senderName">{sender.user_firstname}</p>
                        <img
                          src={sender.image}
                          alt="Profile"
                          className="profileImage"
                        />
                      </div>}
                      {isReplyMessage &&  (<div className="theMessageWrapper">
                        <p className="theMessage">{replyingToMessage}</p>
                      </div>)}
                      <div className="theMessageWrapper">
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
                              recipientId,
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
                      <p>Reply to: {answerName}</p>
                      <button onClick={removeRecipient}>X</button>
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
    margin: 0 0 0 10vw;
    cursor: pointer;
  }

  .ifAnswer {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: grey;
    margin: 0;
    padding: 0;
  }

  .ifAnswer p {
    margin: 0.5vh 0 0 1vw;
  }

  .ifAnswer button {
    margin: 0.5vh 2vw 0 0;
    border: none;
    background-color: transparent;
  }

  .senderInfo {
    display: flex;
    flex-direction: row;
  }

  .profileImage {
    height: 40px;
    width: 40px;
    margin: 0 1vw 0 1vw;
    padding: 0 0 1vh 0;
  }

  .senderName {
    padding: 1.5vh 0 0 1vw;
    margin: 0;
  }

  .theMessage {
    margin: 0;
    word-wrap: break-word;
    /* max-width: 60vw; */
  }

  .theMessageWrapper {
    background: #d9d9d9;
    border-radius: 10px;
    padding: 1.5vh 4vw 1.5vh 4vw;
    margin: 0 3vw 0 3vw;
    max-width: 40vw;
  }
`

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 3vh 0;
  align-items: ${({ isUserMessage }) =>
      isUserMessage ? 'flex-end' : 'flex-start'};

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
