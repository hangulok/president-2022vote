import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify'
import React, { useState, useEffect, useRef } from 'react'

function Home() {
  const inputNewFeature = useRef()
  const inputEmail = useRef()
  const logo = process.env.LOGO ? process.env.LOGO : '/logo.png'
  const [loaded, setLoaded] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    fetch('api/list')
      .then((res) => res.json())
      .then(
        (result) => {
          setItems(result.body)
          setLoaded(true)
          inputNewFeature.current.value = ''
        },
        (error) => {
          setLoaded(true)
        }
      )
  }

  const vote = (event, title) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title }),
    }
    fetch('api/vote', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { hideProgressBar: true, autoClose: 3000 })
        } else {
          refreshData()
        }
      })
  }

  const handleNewFeature = (event) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: inputNewFeature.current.value }),
    }
    fetch('api/create', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { hideProgressBar: true, autoClose: 5000 })
        } else {
          toast.info('후보가 목록에 추가되었습니다.', {
            hideProgressBar: true,
            autoClose: 3000,
          })
          refreshData()
        }
      })
    event.preventDefault()
  }

  const handleNewEmail = (event) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inputEmail.current.value }),
    }
    fetch('api/addemail', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error, { hideProgressBar: true, autoClose: 3000 })
        } else {
          toast.info('귀하의 이메일이 목록에 추가되었습니다.', {
            hideProgressBar: true,
            autoClose: 3000,
          })
          inputEmail.current.value = ''
          refreshData()
        }
      })
    event.preventDefault()
  }

  return (
    <div className="container">
      <Head>
        <title>제20대 대통령선거 예비 후보들의 선호도 조사</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          <img src={logo} alt="Logo" className="logo" />
        </h1>

        <p className="description">
        제20대 대통령선거 예비 후보들의 선호도 조사(2022.03.09. 수요일)
          <br />
          <span className="blue">&#x25B2;</span>
          아래 후보들 중 좋아하는 후보에 투표해 주세요.(2인 이상 투표 가능)
        </p>

        <div className="grid">
          {loaded ? (
            items.map((item, ind) => (
              <div className="card" key={ind}>
                <span>{item.title}</span>
                <div className="upvotediv">
                  <a
                    onClick={(e) => vote(e, item.title)}
                    href={'#' + item.title}
                  >
                    &#x25B2; {item.score}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="card">
              <img src="/loader.gif" />
            </div>
          )}

          <div className="card">
            <form onSubmit={handleNewFeature}>
              <input
                type="text"
                className="noborder"
                ref={inputNewFeature}
                placeholder="추가하고자 하는 후보가 있습니까?"
              />
              <input type="submit" value="저장" className="button" />
            </form>
          </div>

          <div className="card">
            <form onSubmit={handleNewEmail}>
              <input
                type="text"
                className="noborder"
                ref={inputEmail}
                placeholder="투표 결과를 E-mail로 받을 수 있습니다."
              />
              <input type="submit" value="저장" className="button" />
            </form>
          </div>
        </div>
      </main>

      <footer>
        <a
          href="https://vercel.com/integrations/upstash"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <img src="/vercel.svg" alt="Vercel Logo" />
          and
          <img src="/upstash.png" alt="Upstash Logo" />
        </a>
      </footer>
      <ToastContainer />
    </div>
  )
}

export default Home
