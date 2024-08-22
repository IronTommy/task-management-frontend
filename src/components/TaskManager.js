import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import TaskFilter from './TaskFilter'; // Импортируем фильтр
import fetchWithAuth, { refreshToken } from '../authFetch';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(5); // Задаем размер страницы
  const [totalPages, setTotalPages] = useState(0);
  const [filterParams, setFilterParams] = useState({}); // Для фильтрации

  const fetchTasks = useCallback(async () => {
    const queryParams = new URLSearchParams({
      page: pageNumber,
      size: pageSize,
    });
  
    if (filterParams.authorId) {
      queryParams.append('authorId', filterParams.authorId);
    }
  
    if (filterParams.executorId) {
      queryParams.append('executorId', filterParams.executorId);
    }
  
    const response = await fetchWithAuth(`http://localhost:8080/api/tasks?${queryParams.toString()}`, {
      credentials: 'include',
    });

    console.log(`Fetching tasks with URL: http://localhost:8080/api/tasks?${queryParams.toString()}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Received tasks:', data.content);
      setTasks(data.content);
      setTotalPages(data.totalPages);
    } else {
      console.error('Failed to fetch tasks', response.status);
    }
}, [pageNumber, pageSize, filterParams]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = () => {
    fetchTasks();
    setEditingTask(null); // Очищаем форму после добавления задачи
  };

  const handleEditTask = (task) => {
    setEditingTask(task); // Устанавливаем текущую задачу для редактирования
    console.log('Editing task:', task);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        fetchTasks();
        setEditingTask(null); // Очищаем форму после обновления задачи
      } else {
        console.error('Failed to update task', response.status);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const response = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 401) {
      console.warn('Received 401 Unauthorized. Attempting to refresh token.');
      const isRefreshed = await refreshToken();

      if (isRefreshed) {
        console.log('Token refreshed, retrying the delete request.');
        const retryResponse = await fetchWithAuth(`http://localhost:8080/api/tasks/${taskId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (retryResponse.ok) {
          setTasks(tasks.filter((task) => task.id !== taskId));
        } else {
          console.error('Failed to delete task after token refresh', retryResponse.status);
        }
      } else {
        console.error('Token refresh failed. Redirecting to login.');
        window.location.href = '/login';
      }
    } else if (response.ok) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    } else {
      console.error('Failed to delete task', response.status);
    }
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handleFilterChange = (filters) => {
    setFilterParams(filters);
    setPageNumber(0); // Сбрасываем на первую страницу при применении фильтров
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Task Manager
        </Typography>
        <TaskForm
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          editingTask={editingTask} 
        />
        <TaskFilter onFilterChange={handleFilterChange} />
        {console.log('Tasks to display:', tasks)}
        <TaskList
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button
            onClick={() => handlePageChange(pageNumber - 1)}
            disabled={pageNumber === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={pageNumber >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

export default TaskManager;
