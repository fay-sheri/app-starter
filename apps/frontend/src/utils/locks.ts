interface SingleFlightOpts {    
  onReject?: (err: unknown) => void | Promise<void>;
}
interface SingleFiight<T, Args extends unknown[] = []> {
    (...args: Args): Promise<T>;
    readonly pending: boolean;
}


export function createSingleFlight<T, Args extends unknown[] = []>(fn: (...args: Args) => Promise<T> | T, opts?: SingleFlightOpts) {
    let promise: null | Promise<T> = null;
    const wrapper = async function (...args: Args) {
        if (promise) return promise;
        promise = Promise.resolve()
            .then(() => fn(...args))
            .catch((err) => {
                opts?.onReject?.(err); 
                throw err;//不吞错
            })
            .finally(() => {promise = null });  
        return promise;     
    }
    Object.defineProperty(wrapper, "pending", {
        get: () => promise !== null,
    })
    return wrapper as SingleFiight<T, Args>;
}