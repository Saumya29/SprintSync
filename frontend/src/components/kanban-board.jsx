import {useState, useMemo} from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {DraggableCard} from './draggable-card';

const COLUMNS = [
  {id: 'TODO', title: 'To Do', color: 'bg-red-50'},
  {id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50'},
  {id: 'DONE', title: 'Done', color: 'bg-green-50'},
];

function DroppableColumn({column, tasks, onEdit, onDelete}) {
  const {setNodeRef} = useDroppable({
    id: column.id,
  });
  
  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 min-w-[300px] ${column.color} rounded-lg p-4`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{column.title}</h3>
        <span className="bg-white px-2 py-1 rounded text-xs font-medium">
          {tasks.length}
        </span>
      </div>
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[100px]">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No tasks
            </div>
          ) : (
            tasks.map(task => (
              <DraggableCard 
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({tasks, onEdit, onDelete, onStatusChange}) {
  const [activeId, setActiveId] = useState(null);
  
  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const {active, over} = event;
    setActiveId(null);
    
    if (!over) return;
    
    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;
    
    let targetStatus = COLUMNS.find(col => col.id === over.id)?.id;
    if (!targetStatus) {
      const overTask = tasks.find(t => t.id === over.id);
      targetStatus = overTask?.status;
    }
    
    if (targetStatus && activeTask.status !== targetStatus) {
      onStatusChange(activeTask.id, targetStatus);
    }
  };

  const activeTask = useMemo(
    () => tasks.find(t => t.id === activeId),
    [activeId, tasks]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <DroppableColumn
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id]}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <div className="bg-white p-3 rounded shadow-lg opacity-90 cursor-grabbing">
            <h4 className="font-medium text-sm mb-1">{activeTask.title}</h4>
            {activeTask.description && (
              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{activeTask.description}</p>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}