import {useState, useEffect} from 'react';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {generateDescription} from '../services/ai';

export function TaskForm({
  task = null,
  onSubmit,
  onCancel
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    totalMinutes: 0
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        totalMinutes: task.totalMinutes || 0
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
    if (errors[name]) {
      setErrors(prev => ({...prev, [name]: ''}));
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setErrors(prev => ({...prev, title: 'Please enter a title first'}));
      return;
    }

    setIsGenerating(true);
    setErrors({});
    try {
      const response = await generateDescription(formData.title);
      setFormData(prev => ({...prev, description: response.description}));
    } catch (error) {
      console.error('Failed to generate description:', error);
      setErrors(prev => ({...prev, description: 'Failed to generate description. Please try again.'}));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title *
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={!formData.title.trim() || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'AI Suggest'}
          </Button>
        </div>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description or use AI to generate one"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          rows="3"
          disabled={isGenerating}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="totalMinutes" className="block text-sm font-medium mb-2">
            Time Spent (minutes)
          </label>
          <Input
            id="totalMinutes"
            name="totalMinutes"
            type="number"
            value={formData.totalMinutes}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}