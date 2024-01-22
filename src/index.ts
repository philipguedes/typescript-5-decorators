type TriggerInDTO = {
    methodName: string;
    className: string;
}

function loggable() {
    return function logFn<This, Args extends any[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
        ) {
            function replacementMethod(this: This, ...args: Args): Return {
                const methodName = String(context.name);
                const className = this.constructor.name;
                const dto: TriggerInDTO = { methodName, className };
                const logger = this['logger'] ?? undefined;
                logger.info(`LOG: Entering method '${JSON.stringify(context)}'.`)
                const result = target.call(this, ...args);
                logger.info(`LOG: Exiting method '${methodName}'.`)
                return result;
            }
            
            return replacementMethod;
        }
}
// function MeasureTime() {
//     return function (target, key, descriptor): PropertyDescriptor {
//         const originalMethod = descriptor.value;
//         descriptor.value = function (...args) {
//             const start = performance.now();
//             const result = originalMethod.apply(this, args);
//             const end = performance.now();
//             console.log(`Execution time for ${key}: ${end - start} milliseconds`);
//             return result;
//         };
//         return descriptor;
//     }
// }
    


class Logger {
    constructor(private name: string) {}

    info(message: string, params?: any) {
        console.log(this.name, message, params);
    }
}

class UseCase {
    public logger = new Logger(UseCase.name);

    @loggable()
    exec(params: any) {
        this.logger.info("salve rapaziada", params)
    }
}



(function () {
    const useCase = new UseCase();

    useCase.exec({ a: 1, b: 2 });
})()
