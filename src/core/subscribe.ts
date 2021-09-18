import { DataCallback, VoidCallback } from "../types"
import { EMPTY_XID, XID } from "../types/Object";
import { uuid } from "../utils/uuid";

type SubscriberXID = XID;
type EventDataXID = XID;
export class Subscriber<EVENT, DATA> {
  private _xid: XID;

  get xid() {
    return this._xid;
  }

  constructor() {
    this._xid = uuid();
  }

  subscribe(publisher: Publisher<EVENT, DATA>, event: XEvent<EVENT>, listener: DataCallback<DATA>): VoidCallback {
    return publisher.addSubscribe(this, event, listener);
  }
}

type SubscribeEventObject<EVENT, DATA> = {event: XEvent<EVENT>, xid: EventDataXID, listener: DataCallback<XEventData<DATA>>};
export class Publisher<EVENT, DATA> {
  private _subscriberMap!: Map<SubscriberXID, SubscribeEventObject<EVENT, DATA>[]>;

  constructor() {
    this._subscriberMap = new Map();
  }

  publish(event: XEvent<EVENT>, data: XEventData<DATA>): void {
    this._subscriberMap.forEach(subscribeData => {
      subscribeData.forEach(eventData => {
        if (eventData.event === event) {
          eventData.listener(data);
        }
      })
    })
  }

  addSubscribe(subscribe: Subscriber<EVENT, DATA>, event: XEvent<EVENT>, listener: DataCallback<XEventData<DATA>>): VoidCallback {
    const subscribeXID = subscribe.xid;
    const listenerXID = uuid();

    if (!this._subscriberMap.has(subscribeXID)) {
      this._subscriberMap.set(subscribeXID, [])
    }

    const eventList = this._subscriberMap.get(subscribeXID) as SubscribeEventObject<EVENT, DATA>[];
    eventList.push({
      xid: listenerXID,
      event,
      listener,
    });

    this._subscriberMap.set(subscribeXID, eventList)

    return () => {
      const eventList = this._subscriberMap.get(subscribeXID);
      if (!eventList?.length) {
        return;
      }
      const eventListenerIndex = eventList.findIndex(eventObj => {
        return eventObj.xid === listenerXID;
      })

      eventList.splice(eventListenerIndex, 1);
      this._subscriberMap.set(subscribeXID, eventList);
    }
  }
}

export type XEvent<T> = T;
export type XEventData<T> = T;