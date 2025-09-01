import {clsx} from 'clsx';
import {Button} from './ui/button';

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) {
  const statusColors = {
    'TODO': 'bg-gray-100 text-gray-800',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800',
    'DONE': 'bg-green-100 text-green-800'
  };
  
  const statusLabels = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'DONE': 'Done'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{task.title}</h3>
          {task.user && (
            <p className="text-xs text-gray-500 mt-1">Assigned to: {task.user.email}</p>
          )}
        </div>
        <span className={clsx(
          'px-2 py-1 rounded-full text-xs font-medium',
          statusColors[task.status]
        )}>
          {statusLabels[task.status] || task.status}
        </span>
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          {task.totalMinutes > 0 && (
            <span className="text-gray-500">
              {Math.floor(task.totalMinutes / 60)}h {task.totalMinutes % 60}m
            </span>
          )}
        </div>
        
        <div className="flex gap-2 items-center">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-xs sm:text-sm border rounded px-1 sm:px-2 py-1 flex-1 sm:flex-initial"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(task)}
            className="text-xs sm:text-sm"
          >
            Edit
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(task)}
            className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}