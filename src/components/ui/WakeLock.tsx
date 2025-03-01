import { useEffect } from "react";

/**
 * This components presence requests a screen wake lock to prevent the screen from dimming or turning off.
 * 
 * @returns Nothing
 */
const WakeLock = () => {
    useEffect(() => {
        async function wakeLock() {
            if ('wakeLock' in navigator) {
                try {
                    const wakeLock = await navigator.wakeLock.request('screen');
                    wakeLock.addEventListener('release', () => {
                        console.log('Screen Wake Lock released:', wakeLock.released);
                    });
                    return ()=>wakeLock.release();
                } catch (err) {
                    console.error("Error requesting Screen Wake Lock:", err);
                }
            } else {
                console.log('Wake Lock API not supported.');
            }
        }
        wakeLock();
    }, []);

    return null;
}

export default WakeLock;