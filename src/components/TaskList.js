import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskComments from './TaskComments'; // Импортируем компонент

const TaskList = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Tasks
      </Typography>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} divider>
            <ListItemText
              primary={task.title}
              secondary={
                <>
                  <div>Status: {task.status} | Priority: {task.priority} | Executor: {task.executor.firstName} {task.executor.lastName}</div>
                  <div>Author: {task.author.firstName} {task.author.lastName}</div>
                  <div>Created at: {new Date(task.createdDate).toLocaleString()}</div>
                  <TaskComments taskId={task.id} />  {/* Включаем компонент TaskComments */}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => onEditTask(task)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => onDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TaskList;
