import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import fetchWithAuth from '../authFetch';

const TaskComments = ({ taskId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = useCallback(async () => {
    const response = await fetchWithAuth(`http://localhost:8080/api/comments/${taskId}`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      setComments(data);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    const response = await fetchWithAuth('http://localhost:8080/api/comments', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, content: newComment }),
    });

    if (response.ok) {
      setNewComment('');
      fetchComments();
    }
  };

  return (
    <div>
      <List>
        {comments.map(comment => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.content}
              secondary={`Author: ${comment.author.firstName} ${comment.author.lastName}`}
            />
          </ListItem>
        ))}
      </List>
      <TextField
        label="Add a comment"
        fullWidth
        variant="outlined"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAddComment}>
        Add Comment
      </Button>
    </div>
  );
};

export default TaskComments;
