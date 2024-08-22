import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem } from '@mui/material';
import fetchWithAuth from '../authFetch';

const TaskForm = ({ onAddTask, onUpdateTask, editingTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('low');
  const [executorId, setExecutorId] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:8080/api/v1/users', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Failed to fetch users', response.status);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setStatus(editingTask.status);
      setPriority(editingTask.priority);
      setExecutorId(editingTask.executor.id);
    } else {
      // Сбрасываем форму, если нет задачи для редактирования
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('low');
      setExecutorId('');
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!executorId) {
      alert('Please select an executor.');
      return;
    }

    const taskData = {
      title,
      description,
      status,
      priority,
      executorId,
    };

    if (editingTask) {
      // Если мы редактируем задачу, вызываем onUpdateTask
      onUpdateTask({ ...editingTask, ...taskData });
    } else {
      // Иначе добавляем новую задачу
      const response = await fetchWithAuth('http://localhost:8080/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        onAddTask();
      } else {
        console.error('Failed to create task', response.status);
      }
    }

    setTitle('');
    setDescription('');
    setStatus('pending');
    setPriority('low');
    setExecutorId('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Status"
            fullWidth
            variant="outlined"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Priority"
            fullWidth
            variant="outlined"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Executor"
            select
            fullWidth
            variant="outlined"
            value={executorId}
            onChange={(e) => setExecutorId(e.target.value)}
            required
          >
            {users.length > 0 ? (
              users.map(user => (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                No users available
              </MenuItem>
            )}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskForm;
