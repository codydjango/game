interface IEvent {
  event: string;
  fn: () => void;
  once: boolean;
  thisValue: any;
}

class EventManager {
  public eventsList: IEvent[];

  constructor() {
    this.eventsList = []; // create array of events
  }

  public subscribe(
    event: string,
    fn: (p?: any) => void,
    thisValue?: any,
    once = false,
  ) {
    if (typeof thisValue === 'undefined') {
      // if no thisValue provided, binds the fn to the fn??
      thisValue = fn;
    }

    this.eventsList.push({
      // create objects linking events + functions to perform
      event, // push em to the array
      fn,
      once,
      thisValue,
    });
  }

  // unsubscribe(event) {
  //     for (let i = 0; i < this.eventsList.length; i++) {
  //         if (this.eventsList[i].event === event) {
  //             this.eventsList.splice(i, 1)
  //             break
  //         }
  //     }
  // }

  public publish(event: string, ...arg: any) {
    for (let i = 0; i < this.eventsList.length; i++) {
      if (this.eventsList[i].event === event) {
        const { thisValue, fn, once } = this.eventsList[i];
        fn.call(thisValue, ...arg);
        if (once) {
          this.eventsList.splice(i, 1);
        }
      }
    }
  }

  public getEventsList() {
    return this.eventsList;
  }
}

export default new EventManager();
