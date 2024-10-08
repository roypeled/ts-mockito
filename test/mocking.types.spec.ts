import {MethodToStub} from "../src/MethodToStub";
import {instance, mock, when} from "../src/ts-mockito";
import {Bar} from "./utils/Bar";
import {ThenableClass} from "./utils/Thenable";
import {EventEmitter} from "events";

describe("mocking", () => {
    describe("mocking abstract class", () => {
        let mockedFoo: SampleAbstractClass;
        let foo: SampleAbstractClass;

        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given

            // when
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // then

        });

        it("does create own property descriptors on mock", () => {
            // given

            // when
            mockedFoo = mock(SampleAbstractClass);

            // then
            expect((mockedFoo.twoPlusTwo as any) instanceof MethodToStub).toBe(true);
        });

        it("does create own property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.twoPlusTwo).thenReturn(42);

            // then
            expect(foo.twoPlusTwo).toBe(42);
        });

        it("does create inherited property descriptors on mock", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when

            // then
            expect((mockedFoo.sampleString as any) instanceof MethodToStub).toBe(true);
        });

        it("does create inherited property descriptors on instance", () => {
            // given
            mockedFoo = mock(SampleAbstractClass);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.sampleString).thenReturn("42");

            // then
            expect(foo.sampleString).toBe("42");
        });
    });
    describe("mocking promise methods", () => {
        it("does not create then descriptor for class", () => {
            // given
            const mocked = mock(SampleAbstractClass);
            const inst = instance(mocked);

            // when

            // then
            expect((inst as any).then).toBeUndefined();
        });

        it("does create then descriptor", () => {
            // given
            const mocked = mock(ThenableClass);
            const inst = instance(mocked);

            // when
            when(mocked.then()).thenReturn("42");

            // then
            expect(inst.then()).toEqual("42");
        });

        it("does not create catch descriptor", () => {
            // given
            const mocked = mock(SampleAbstractClass);
            const inst = instance(mocked);

            // when

            // then
            expect((inst as any).catch).toBeUndefined();
        });

        it("does create catch descriptor", () => {
            // given
            const mocked = mock(ThenableClass);
            const inst = instance(mocked);

            // when
            when(mocked.catch()).thenReturn("42");

            // then
            expect(inst.catch()).toEqual("42");
        });

        it("default object formatting works", () => {
            // given
            const mocked = mock(ThenableClass);
            const inst = instance(mocked);

            // when

            // then
            const str = `"${inst}"`;
            expect(str).toEqual('"[object Object]"');
        });
    });

    describe("mocking class with hasOwnProperty", () => {
        let mockedFoo: SampleClassWithHasOwnProperty;

        it("does not attempt to mock hasOwnProperty (which would throw)", () => {
            // given

            // when
            mockedFoo = mock(SampleClassWithHasOwnProperty);

            // then

        });
    });

    describe("mocking generic class", () => {
        let mockedFoo: SampleGeneric<SampleInterface>;
        let foo: SampleGeneric<SampleInterface>;

        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given

            // when
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);
            foo = instance(mockedFoo);

            // then

        });

        it("does create own property descriptors on mock", () => {
            // given

            // when
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);

            // then
            expect((mockedFoo.twoPlusTwo as any) instanceof MethodToStub).toBe(true);
        });

        it("allows to mock method with generic return type value (with IDE completion)", () => {
            // given
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);
            foo = instance(mockedFoo);
            const expectedResult = new SampleInterfaceImplementation();
            when(mockedFoo.getGenericTypedValue()).thenReturn(expectedResult);

            // when
            const result = foo.getGenericTypedValue();

            // then
            expect(expectedResult).toEqual(result);
        });

        it("does create own property descriptors on instance", () => {
            // given
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.twoPlusTwo).thenReturn(42);

            // then
            expect(foo.twoPlusTwo).toBe(42);
        });

        it("does create inherited property descriptors on mock", () => {
            // given
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);
            foo = instance(mockedFoo);

            // when

            // then
            expect((mockedFoo.sampleString as any) instanceof MethodToStub).toBe(true);
        });

        it("does create inherited property descriptors on instance", () => {
            // given
            mockedFoo = mock<SampleGeneric<SampleInterface>>(SampleGeneric);
            foo = instance(mockedFoo);

            // when
            when(mockedFoo.sampleString).thenReturn("42");

            // then
            expect(foo.sampleString).toBe("42");
        });
    });

    describe("mocking object which doesn't inherit from anything", () => {
        it("does not execute getter or setter code (not throwing null pointer exception)", () => {
            // given
            const bareObject = Object.create(null);

            // when
            const mockedObject = mock(bareObject);
            instance(mockedObject);

            // then

        });
    });

    describe("mocking native class", () => {
        it("should mock", () => {
            const mocked = mock(TestEmitter);
            expect(mocked).toBeDefined();
        });
    });

    describe("mocking anon class", () => {
        it("should mock", () => {
            const mocked = mock(TestAnonClass);
            expect(mocked).toBeDefined();
        });
    });

    describe("mocking async class", () => {
        it("should mock", () => {
            const mocked = mock(AsyncClass);
            expect(mocked).toBeDefined();
        });
    });

    describe("mocking generator class", () => {
        it("should mock", () => {
            const mocked = mock(getGeneratorClass());
            expect(mocked).toBeDefined();
        });
    });

    describe("mock empty object", () => {
        it("should mock", () => {
            const mocked = mock({});
            expect(mocked).toBeDefined();
        });
    });
});

abstract class SampleAbstractClass {
    public dependency: Bar;

    public get sampleString(): string {
        return "sampleString";
    }

    public get twoPlusTwo(): number {
        return this.dependency.sumTwoNumbers(2, 2);
    }

    public set twoPlusTwo(value: number) {
        this.dependency.sumTwoNumbers(value, 0);
    }

    public sampleMethod(): number {
        return 4;
    }
}

class SampleClassWithHasOwnProperty {
    public hasOwnProperty(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this, name);
    }
}

interface SampleInterface {
    dependency: Bar;

    sampleMethod(): number;
}

class SampleInterfaceImplementation implements SampleInterface {
    public dependency: Bar;

    public sampleMethod(): number {
        return 999;
    }
}

class SampleGeneric<T> {
    public dependency: Bar;

    public get twoPlusTwo(): number {
        return this.dependency.sumTwoNumbers(2, 2);
    }

    public set twoPlusTwo(value: number) {
        this.dependency.sumTwoNumbers(value, 0);
    }

    public get sampleString(): string {
        return "sampleString";
    }

    public sampleMethod(): number {
        return 4;
    }

    public getGenericTypedValue(): T {
        return null as unknown as T;
    }
}

class TestEmitter extends EventEmitter {
}

const TestAnonClass = class {
    private readonly foo = 'abc';
};

export class AsyncClass {
    public asyncValueArrowFn = async () => 'value';

    public asyncValueFn = async function hello() {
        return 'value';
    };

    public async returnAsyncValue(): Promise<number> {
        return 0;
    }
}

// Generator functions in eval to prevent downcompiling generators to classic functions
// tslint:disable-next-line:no-eval
const getGeneratorClass = () => eval(`class GeneratorClass {

    asyncValueFn = async function* hello() {
        return 'value';
    };

    valueFn = function* hello() {
        return 'value';
    };

    async *returnAsyncValue() {
        return 0;
    }

    *returnValue() {
        return 0;
    }
}

GeneratorClass
`);
