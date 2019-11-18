import { FC, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import removeNode from 'qj/removeNode';

const defaultGetRoot = () => {
	const rootElm = document.createElement('div');
	document.body.appendChild(rootElm);
	return rootElm;
};

interface P {
	getRoot?: () => Element;
}

const Portal: FC<P> = ({ getRoot, children }) => {
	const [rootElm, setRootElm] = useState<Element | null>(null);
	useEffect(() => {
		setRootElm((getRoot || defaultGetRoot)());
		return () => {
			rootElm && removeNode(rootElm);
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return rootElm ? createPortal(children, rootElm) : null;
};

export default Portal;
