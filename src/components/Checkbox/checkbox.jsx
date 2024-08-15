import { forwardRef } from 'react';
import styles from './Checkbox.module.scss';
import clsx from 'clsx';



const Checkbox = forwardRef(
  ({ className, label, name, error, ...rest }, ref) => {
    return (
      <div className={className}>
        <div className='flex items-center'>
          <input
            id={name}
            name={name}
            type='checkbox'
            ref={ref}
            className={clsx(styles['checkbox'])}
            {...rest}
          />

          <label
            htmlFor={name}
            className={clsx(
              `text-blue text-2xl `,
              error && styles['error']
            )}
          >
            {label}
          </label>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
