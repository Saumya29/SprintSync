import {useMemo} from 'react';

const COLUMNS = [
  {id: 'TODO', title: 'To Do', color: 'bg-red-50'},
  {id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50'},
  {id: 'DONE', title: 'Done', color: 'bg-green-50'},
];

export function KanbanBoard({tasks, onEdit, onDelete}) {
  const tasksByColumn = useMemo(() => {
    const grouped = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    
    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    
    return grouped;
  }, [tasks]);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <div key={column.id} className={`flex-1 min-w-[300px] ${column.color} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{column.title}</h3>
              <span className="bg-white px-2 py-1 rounded text-xs font-medium">
                {tasksByColumn[column.id].length}
              </span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {tasksByColumn[column.id].length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No tasks
                </div>
              ) : (
                tasksByColumn[column.id].map(task => (
                <div key={task.id} className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow cursor-pointer">
                  <h4 className="font-medium text-sm mb-1">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {task.totalMinutes ? `${task.totalMinutes} min` : 'No time logged'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(task)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        ))}
    </div>
  );
}