import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export function DraggableCard({task, onEdit, onDelete}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: task.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-3 rounded shadow hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'z-50' : ''
      }`}
    >
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
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-blue-600 hover:text-blue-800 text-xs"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="text-red-600 hover:text-red-800 text-xs"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}