export type EventBusCallback<P> = (data: P) => any;

export class EventBus<T, P> {
  private readonly map: Map<T, EventBusCallback<P>[]> = new Map();

  /**
   * Subscribe to event
   * @param type Event type
   * @param callback Event callback
   */
  on(type: T, callback: EventBusCallback<P>) {
    const callbacks = this.map.get(type);
    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.map.set(type, [callback]);
    }
  }

  off(type?: T, callback?: EventBusCallback<P>) {
    if (type) {
      if (callback) {
        const cbs = this.map.get(type)
        if (!cbs) return
        const index = cbs.findIndex((i) => i === callback)
        if (index >= 0) cbs.splice(index, 1)
      } else {
        this.map.delete(type)
      }
    } else {
      this.map.clear()
    }
  }

  /**
   * Emit event
   * @param type Event type
   * @param data Event data
   */
  emit(type: T, data: P) {
    const callbacks = this.map.get(type) ?? [];
    for (let cb of callbacks) {
      cb && cb(data);
    }
  }
}
