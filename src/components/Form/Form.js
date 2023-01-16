import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';
import ChipInput from "material-ui-chip-input";

import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';

import defaultImage from "../../images/base64";

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: defaultImage });
  const post = useSelector(({ posts: state }) => currentId ? state.posts.find((p) => p._id === currentId) : null)
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem('profile'));

  console.log(useSelector)

  useEffect(() => {
    if(post) setPostData(post)
  }, [post])

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(postData)
    if (currentId) {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name}))
    } else {
      dispatch(createPost({ ...postData, name: user?.result?.name }))
    }
    clear();
  };

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    )
  }

  const clear = () => {
    setCurrentId(null);
    setPostData({ title: '', message: '', tags: '', selectedFile: '' })
  }

  const handleAddTag = (tag) => {
    setPostData({ ...postData, tags: [...postData.tags, tag] })
  }

  const handleDeleteTag = (tagToDelete) => {
    setPostData({ ...postData, tags: postData.tags.filter((tag) => tag !== tagToDelete) })
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete='off' noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant='h6'>{currentId ? 'Editing' : 'Creating'} a Memory</Typography>
        <TextField name='title' variant='outlined' label='Title' fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value})}/>
        <TextField name='message' variant='outlined' label='Message' fullWidth value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value})}/>
        {/* <TextField name='tags' variant='outlined' label='Tags' fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',')})}/> */}
        <ChipInput 
          name='tags'
          style={{ margin: '10px' }}
          value={[...postData.tags]}
          onAdd={handleAddTag}
          onDelete={handleDeleteTag}
          label='Tags'
          variant='outlined'
          newChipKeys={['Enter', 'Tab', ' ', ',']}
          fullWidth
        />
        <div className={classes.fileInput}>
          <FileBase type='file' multiple={false} onDone={({base64}) => setPostData({ ...postData, selectedFile: base64})}/>
        </div>
        <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
        <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>


      </form>
    </Paper>
  )
}

export default Form