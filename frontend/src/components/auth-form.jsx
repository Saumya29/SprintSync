import {Link} from 'react-router-dom';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Snackbar} from './ui/snackbar';

export function AuthForm({
  title,
  fields,
  onSubmit,
  submitText,
  footerText,
  footerLink,
  footerLinkText,
  snackbar,
  hideSnackbar
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              </div>
            ))}

            <Button type="submit" className="w-full">
              {submitText}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            {footerText}{' '}
            <Link to={footerLink} className="text-primary hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
      <Snackbar 
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={hideSnackbar}
      />
    </div>
  );
}