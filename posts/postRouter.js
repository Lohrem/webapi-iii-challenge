const express = require('express')
const Posts = require('./postDb.js')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get(req.query)
    res.status(200).json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error retrieving posts',
    })
  }
})

router.get('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Posts.getById(req.params.id)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({
        message: 'post not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error retrieving post',
    })
  }
})

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const count = await Posts.remove(req.params.id)
    if (count > 0) {
      res.status(200).json({
        message: 'post has been deleted'
      })
    } else {
      res.status(404).json({
        message: 'post could not be found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error removing post',
    })
  }
})

router.put('/:id', validatePostId, async (req, res) => {
  try {
    const post = await Posts.update(req.params.id, req.body)
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({
        message: 'The post could not be found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error updating post',
    })
  }
})

// custom middleware

async function validatePostId(req, res, next) {
  try {
    const {
      id
    } = req.params
    const post = await Posts.getById(id)
    if (post) {
      req.post = post
      next()
    } else {
      res.status(404).json({
        message: "invalid post id"
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

module.exports = router