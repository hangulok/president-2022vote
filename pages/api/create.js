import { getRedis } from './utils'

module.exports = async (req, res) => {
  let redis = getRedis()
  const body = req.body
  const title = body['title']
  if (!title) {
    redis.quit()
    res.json({
      error: '후보명을 입력해 주세요.',
    })
  } else if (title.length < 20) {
    await redis.zadd('roadmap', 'NX', 1, title)
    redis.quit()
    res.json({
      body: 'success',
    })
  } else {
    redis.quit()
    res.json({
      error: '최대 20 자까지 입력하세요.',
    })
  }
}
