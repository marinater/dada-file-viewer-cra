import { useRef, useEffect } from 'react';

const useEventListener = (eventName: string, handler: (event: any) => void) => {
	const savedHandler = useRef<(event: any) => void>(() => {});

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const isSupported = window.addEventListener
		if (!isSupported) return;

		const eventListener = (event: any) => savedHandler.current(event)
		window.addEventListener(eventName, eventListener);

		return () => {window.removeEventListener(eventName, eventListener)}
	}, [eventName])
}

export default useEventListener;