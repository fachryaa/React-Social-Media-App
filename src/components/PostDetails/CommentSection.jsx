import React, { useState, useRef } from 'react'
import { TextField, Button, Typography } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import useStyles from './styles'

import { commentPost } from '../../actions/posts'

const CommentSection = ({ post }) => {
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()
  const commentsRef = useRef();

  const user = JSON.parse(localStorage.getItem('profile'))

  const handleClick = async () => {
    const finalComment = `${user.result.name}: ${comment}`;
    const newComment = await dispatch(commentPost(finalComment, post._id))

    setComments([...comments, newComment]);
    setComment('')

    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">Comments</Typography>
          {comments.map((c) => (
            <Typography key={c} gutterBottom variant="subtitle1">
              <strong>{c.split(':')[0]}</strong> :
              {c.split(':')[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: '70%' }}>
            <Typography gutterBottom variant="h6">Write a comment</Typography>
            <TextField fullWidth minRows={4} variant="outlined" label="Comment" multiline value={comment} onChange={(e) => setComment(e.target.value)} />
            <Button style={{ marginTop: '10px' }} fullWidth disabled={!comment.length} variant="contained" color="primary" onClick={handleClick}>Comment</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommentSection