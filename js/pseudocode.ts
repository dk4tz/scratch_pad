// statcast processor

// game stream class
    // websocket attribute

    // private constructor

    // static async connect method
        // create new stream
        // try connecting to websocket url
        // resolve on connect
        // reject on error
        // return stream

    // close 
        // if closed, return
        // try closing
            // resolve on close
            // reject on error

    // reconnect
        // how many times have we tried to reconnect?
        // if less than max
            // try connecting to websocket
                // on connect --> reset count
            // catch error
                // increment tries
                // reconnect
        // if over limit
            // throw error
    

    // async *[Symbol.asyncIterator]() -- websocket
        // while web socket is open and ready
            // try 
                // yield a promise for an event
                    // on message -> resolve
                    // on error -> reject
            // catch
                // throw error

    // async *[Symbol.asyncIterator]() -- polling
        // set polling to true
        // get last timestamp to include in fetch
        // while polling
            // try
                // fetch from url and jsonify
                // sort events by timestamp
                // for event in events - update last timestamp and yield event
                // new Promise<void>((res, _) => setTimeout(() => res(), timeout))
            // catch    
                // error
                // polling = false


// class Processor
    // queues - Map
    // processing - Set
    // subscriber - Set

    // ingest(stream) 
        // for await (const event of stream)
            // key = event.game
            // does the queue exist?
                // no - create it
            // push event to queue
            
            // is queue processing?
                // no - add to processing, this.process(key).catch(errors)
    
    // process(key)
        // try all this
        // if queue doesn't exist, return
        // while the queue has length
            // shift the next event
            // process that event some how
            // results = await promises from notify the subscribers
            // loop through results and flag error states
        // after loop, delete the queue
        // finally, stop processing

