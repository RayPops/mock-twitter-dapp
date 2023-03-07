import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import {useDebounce} from  'usehooks-ts';
import Tweet from './components/Tweet';
import Twitter from './contracts/Twitter.json'
import styled from 'styled-components'
import "./App.css"

const CONTRACT_ADDRESS = 'TO BE FILLED IN'



function App() {

  const [message, setMessage] = React.useState("")
  const debounceMessage = useDebounce(message, 500)

  const { data: tweets, refetch } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: Twitter.abi,
    functionName: 'getFeed',
    chainId: 5,
    watch: true
  })

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: Twitter.abi,
    functionName: 'tweet',
    chainId: 5,
    args: [message],
    enabled: Boolean(debounceMessage)
  })
  const { data: res, write } = useContractWrite(config)

  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: res?.hash,
  })

  const handleClick = async () => {
    const res = await refetch()
    console.log(`Greeting: ${res}`, res)
  }


  return (
    <Wrapper>
    <NavBar>
      <h3>Decentralised Twitter</h3>
      <h4>built by RP</h4>
     
    <ConnectButton />
    </NavBar>


          <TweetContainer>

          <textarea name="" onChange={(e) => setMessage(e.target.value)} value={message} id="" placeholder='> Enter your tweet' cols="30" rows="5"></textarea>
          <button disabled={!write || isLoading} onClick={(e) => {e.preventDefault(); write?.();}}>
            {isLoading ? 'Tweeting...' : 'Tweet'}
            </button></TweetContainer>
            <TweetsWrapper>
        {tweets && tweets.map(tweet => (
          <Tweet tweet={tweet} />
        ))}
        </TweetsWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  padding: 0px;
  margin: 0px;
`

const TweetsWrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
`

const NavBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 32px;
  min-width: 1000px;
`

const TweetContainer = styled.div`
  padding: 2rem;
  width: 300px;
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.07);
  textarea {
    resize: none;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 16px;
    
  }

  button {
    color: white;
    background-color: #0152fe;
    font-weight: bold;
    font-size: 15px;
    border: none;
    outline: none;
    padding: 8px;
    border-radius: 7px;
    cursor: pointer;
    :hover {
      opacity: 0.7;
    }
    :disabled {
      opacity: 0.7;
    }
  }
`

export default App;