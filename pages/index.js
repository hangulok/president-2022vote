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
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge"></meta>
        <meta name="viewport" content="width=device-width,initial-scale=1"></meta>
        <title>제20대 대통령선거 예비 후보들의 선호도 조사</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
        제20대 대통령선거 예비 후보들의 선호도 조사
        </h1>

        <p className="description">
          (대선 예정일 : 2022.03.09. 수요일)
          <br />
          (설문 시작일 : 2021.03.01. 월요일)
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
          href="https://365ok.co.kr"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by
          <img src={logo} alt="Logo" className="logo" />
        </a>
      </footer>
      <ToastContainer />
    </div>
  )
}

export default Home
