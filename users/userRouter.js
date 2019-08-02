const express = require('express')
const Users = require('./userDb.js')
const router = express.Router()

async function validateUserId(req, res, next) {
  try {
    const {
      id
    } = req.params
    const user = await Users.getById(id)
    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({
        message: "invalid user id"
      })
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

async function validateUser(req, res, next) {
  console.log(req.body)
  try {
    console.log(req.body)
    const {
      name
    } = req.body
    if (name) {
      req.name = name
      next()
    } else {
      res.status(400).json({
        message: "missing user data"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function validatePost(req, res, next) {
  try {
    const {
      text
    } = req.body
    if (text) {
      req.text = text
      next()
    } else {
      res.status(400).json({
        message: "missing required text field"
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

router.post('/', validateUser, async (req, res) => {
  try {
    const user = await Users.insert(req.body)
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error adding the user',
    })
  }
})

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    const post = await Users.insert({ user_id: req.id, text: req.text })
    res.status(201).json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error adding the post',
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await Users.get(req.query)
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error retrieving users',
    })
  }
})

router.get('/:id', validateUserId, async (req, res) => {
  try {
    const user = await Users.getById(req.params.id)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        message: 'User not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error retrieving user',
    })
  }
})

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.params.id)
    if (posts) {
      res.status(200).json(posts)
    } else {
      res.status(404).json({
        message: 'User with specified ID was not found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error retrieving data',
    })
  }
})

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const count = await Users.remove(req.params.id)
    if (count > 0) {
      res.status(200).json({
        message: 'user has been deleted'
      })
    } else {
      res.status(404).json({
        message: 'user could not be found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error removing user',
    })
  }
})

router.put('/:id', validateUserId, validatePost, async (req, res) => {
  try {
    const user = await Users.update(req.params.id, req.body)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        message: 'The user could not be found'
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error updating user',
    })
  }
})

module.exports = router;