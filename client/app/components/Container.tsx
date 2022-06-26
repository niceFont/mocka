import {PropsWithChildren} from 'react';
import clsx from 'clsx';

function Container({children, className, ...props} : PropsWithChildren<any>) {
	return (
		<div {...props} className={clsx('p-8 w-3/4 mb-20 max-w-[1000px] rounded-lg shadow-lg bg-white  border-gray-100 border-2', className)}>
			{children}
		</div>
	);
}

export default Container;
