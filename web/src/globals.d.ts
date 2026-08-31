/* The handful of things the world hangs on `window`.
 *
 * Five debug handles and one vendor-prefixed constructor. Without these the
 * scene cannot be type-checked at all: `window.__game = game` is an error on
 * a `Window` that has never heard of it, and `window.webkitAudioContext` is
 * the Safari spelling that keeps audio working on older iOS.
 *
 * Typed loosely on purpose. The point of checking world.js is to catch the
 * arithmetic and the property that does not exist, not to describe eight
 * thousand lines of scene in a declaration file that would then have to be
 * kept true.
 */
export {};

declare global {
  interface Window {
    /** the Game instance, once boot() has one */
    __game?: any;
    /** the synthesised audio object */
    __snd?: any;
    /** the arcade shell */
    __arc?: any;
    /** the cave network's query functions */
    __cave?: any;
    /** where the cat is, what it is near, what it has found */
    __cat?: () => any;
    /** errors parked by the inline script in app/layout.tsx */
    __errs?: string[];
    /** Safari's spelling, still needed on older iOS */
    webkitAudioContext?: typeof AudioContext;
  }
}
