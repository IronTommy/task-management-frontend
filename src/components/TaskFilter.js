import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid } from '@mui/material';
import fetchWithAuth from '../authFetch';

const TaskFilter = ({ onFilterChange }) => {
  const [authorId, setAuthorId] = useState('');
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

  const handleFilterChange = () => {
    onFilterChange({ authorId, executorId });
  };

  return (
    <Grid container spacing={2} style={{ marginBottom: '20px' }}>
      <Grid item xs={6}>
        <TextField
          label="Author"
          select
          fullWidth
          variant="outlined"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Executor"
          select
          fullWidth
          variant="outlined"
          value={executorId}
          onChange={(e) => setExecutorId(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterChange}
          fullWidth
        >
          Apply Filters
        </Button>
      </Grid>
    </Grid>
  );
};

export default TaskFilter;
